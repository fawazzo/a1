import { pool } from "../config/db.js";

// ========================================================
// 1) CREATE ORDER  (cart → order)
// ========================================================
export const createOrder = async (req, res) => {
  const userId = req.user.id;// استخراج userId من التوكن (middleware auth)

// البيانات القادمة من التطبيق
const { payment_method, delivery_address, delivery_fee } = req.body;
// تحقق أولي
if (!payment_method || !delivery_address) {
    return res.status(400).json({
      message: "payment_method and delivery_address are required"
    });
  }

// الحصول على اتصال منفصل من الـ pool
// ضروري لاستخدام Transaction
const connection = await pool.getConnection();

  try {
    await connection.beginTransaction();//بدء Transaction

    // 1️.جلب السلة الحالية لهذا المستخدم
    const [cartRows] = await connection.query(
      "SELECT * FROM cart WHERE user_id = ? LIMIT 1",
      [userId]
    );
    // إذا لم تكن هناك سلة
    if (cartRows.length === 0) {
        await connection.rollback();// إلغاء أي تغيير
      return res.status(400).json({ message: "Cart is empty" });
    }

    const cart = cartRows[0];

    // 2️.جلب عناصر السلة + أسعار الأطباق
    const [cartItems] = await connection.query(
      `SELECT 
        ci.quantity,
        d.id AS dish_id,
        d.price
      FROM cart_items ci
      JOIN dishes d ON ci.dish_id = d.id
      WHERE ci.cart_id = ?`,
      [cart.id]
    );
    // إذا كانت السلة موجودة لكن بدون عناصر
    if (cartItems.length === 0) {
      await connection.rollback();
      return res.status(400).json({ message: "Cart has no items" });
    }

    // 3️.حساب إجمالي السعر
    let totalPrice = 0;
    cartItems.forEach(item => {
      totalPrice += item.price * item.quantity;
    });

    // إضافة رسوم التوصيل
    const finalTotal = totalPrice + (delivery_fee || 0);
    // 4️.إنشاء سجل جديد في orders
    const [orderResult] = await connection.query(
      `INSERT INTO orders 
        (user_id, restaurant_id, total_price, payment_method, payment_status, delivery_address, delivery_fee, status)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [userId, cart.restaurant_id, finalTotal, payment_method, "pending", delivery_address, delivery_fee || 0, "pending"]
    );
    // رقم الطلب الجديد
    const orderId = orderResult.insertId;

    // 5.نقل عناصر السلة إلى order_items
    for (const item of cartItems) {
      await connection.query(
        `INSERT INTO order_items 
          (order_id, dish_id, quantity, price)
         VALUES (?, ?, ?, ?)`,
        [orderId, item.dish_id, item.quantity, item.price]
      );
    }

    // 6️.حذف عناصر السلة
    await connection.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
    //7.حذف السلة نفسها
    await connection.query("DELETE FROM cart WHERE id = ?", [cart.id]);

    // ✅ تأكيد العملية (Commit)
    await connection.commit();
    // 8. رد النجاح
    res.json({
      message: "Order created successfully",
      order_id: orderId,
      total_price: finalTotal,
      payment_method,
      payment_status: "pending",
      delivery_fee: delivery_fee || 0,
      delivery_address
    });

  } catch (err) {
    // في حال أي خطأ → إلغاء كل ما سبق
    await connection.rollback();
    console.error("CreateOrder Error:", err);
    res.status(500).json({ message: "Server error" });
  }finally {
    //  إعادة الاتصال إلى الـ pool
    connection.release();
    }
};


//Kullanıcı istekleri alınıyor
export const getMyOrders = async (req, res) => {
  try {
    const userId = req.user.id;

    const [orders] = await pool.query(
      `SELECT 
        o.*,
        r.name AS restaurant_name
      FROM orders o
      LEFT JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.user_id = ?
      ORDER BY o.created_at DESC`,
      [userId]
    );

    res.json(orders);
  } catch (err) {
    console.error("Get Orders Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

//Order details
export const getOrderDetails = async (req, res) => {
  try {
    const { id } = req.params;
    const userId = req.user.id;

    // Check if order belongs to user
    const [order] = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [id, userId]
    );

    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const [items] = await pool.query(
      `SELECT oi.quantity, oi.price, d.name 
             FROM order_items oi 
             JOIN dishes d ON oi.dish_id = d.id 
             WHERE oi.order_id = ?`,
      [id]
    );

    res.json({
      order: order[0],
      items,
    });
  } catch (err) {
    console.error("Order Details Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// 4) Get Seller Orders (for restaurants owned by seller)
// ============================
export const getSellerOrders = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // تأكد أن هذا المستخدم بائع
    const [userRows] = await pool.query(
      "SELECT is_seller FROM users WHERE id = ?",
      [sellerId]
    );

    if (userRows.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (userRows[0].is_seller !== 1) {
      return res
        .status(403)
        .json({ message: "Only sellers can see seller orders" });
    }

    // جلب الطلبات التي تخص مطاعم هذا البائع
    const [orders] = await pool.query(
      `SELECT 
                o.*,
                u.name AS user_name,
                r.name AS restaurant_name
             FROM orders o
             JOIN restaurants r ON o.restaurant_id = r.id
             JOIN users u ON o.user_id = u.id
             WHERE r.seller_id = ?
             ORDER BY o.created_at DESC`,
      [sellerId]
    );

    res.json(orders);
  } catch (err) {
    console.error("Get Seller Orders Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ============================
// Update Order Status (Seller Only)
// منع تغيير الحالة قبل الدفع إذا كانت طريقة الدفع online
// ============================
export const updateOrderStatus = async (req, res) => {
  try {
    // 1) sellerId يأتي من التوكن بعد authRequired
    const sellerId = req.user.id;

    // 2) id = رقم الطلب من الرابط  /api/orders/:id/status
    const { id } = req.params;

    // 3) status = الحالة الجديدة من Body
    const { status } = req.body;

    // 4) حالات مسموح للبائع يغيّر إليها
    const allowedStatuses = [
      "pending",
      "preparing",
      "on_the_way",
      "delivered",
      "cancelled",
    ];

    // ✅ تحقق: لازم status موجودة ومسموح بها
    if (!status || !allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status value" });
    }

    // 5) نجيب الطلب بشرط:
    // - الطلب موجود
    // - الطلب يخص مطعم هذا البائع (seller_id)
    // ونجيب payment_method و payment_status لأننا سنمنع التحديث إذا الدفع لم يتم
    const [orderRows] = await pool.query(
      `
      SELECT o.payment_method, o.payment_status
      FROM orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      WHERE o.id = ? AND r.seller_id = ?
      LIMIT 1
      `,
      [id, sellerId]
    );

    // ✅ إذا لم نجد الطلب -> يعني إما غير موجود أو ليس من مطاعم هذا البائع
    if (orderRows.length === 0) {
      return res
        .status(404)
        .json({ message: "Order not found for this seller" });
    }

    const order = orderRows[0];

    // 6) شرط الحماية الأساسي:
    // إذا كانت طريقة الدفع online والدفع ليس paid -> ممنوع البائع يغيّر status
    if (order.payment_method === "online" && order.payment_status !== "paid") {
      return res.status(403).json({
        message: "Cannot update order status before online payment is completed",
        payment_status: order.payment_status,
      });
    }

    // 7) تنفيذ التحديث: نحدث حالة الطلب بشرط أنه ما زال يخص نفس البائع
    const [result] = await pool.query(
      `
      UPDATE orders o
      JOIN restaurants r ON o.restaurant_id = r.id
      SET o.status = ?, o.updated_at = CURRENT_TIMESTAMP
      WHERE o.id = ? AND r.seller_id = ?
      `,
      [status, id, sellerId]
    );

    // ✅ احتياط: لو ما تم تحديث أي صف (نادرًا) نرجع 404
    if (result.affectedRows === 0) {
      return res
        .status(404)
        .json({ message: "Order not found for this seller" });
    }

    // 8) رد نجاح
    return res.json({
      message: "Order status updated",
      order_id: Number(id),
      new_status: status,
    });
  } catch (err) {
    console.error("Update Order Status Error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};



//  ==========================
// 5) updatePaymentStatus
//  ==========================
export const updatePaymentStatus = async (req, res) => {
  try {
    const { id } = req.params;
    const { payment_status } = req.body;

    // نسمح فقط بهذه القيم
    const allowed = ["pending", "paid", "failed"];
    if (!allowed.includes(payment_status)) {
      return res.status(400).json({ message: "Invalid payment status" });
    }

    await pool.query(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [payment_status, id]
    );

    res.json({
      message: "Payment status updated",
      order_id: id,
      new_status: payment_status,
    });
  } catch (err) {
    console.error("Payment Update Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};

// ========================================================
// 6) CANCEL ORDER (User only, status must be 'pending')
// ========================================================
export const cancelOrder = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.user.id;

    // 1) إحضار الطلب والتأكد أنه موجود
    const [rows] = await pool.query(
      "SELECT id, user_id, status, payment_status FROM orders WHERE id = ?",
      [orderId]
    );

    if (rows.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = rows[0];

    // 2) التأكد أن هذا الطلب تابع للمستخدم الحالي
    if (order.user_id !== Number(userId)) {
      return res
        .status(403)
        .json({ message: "You are not allowed to cancel this order" });
    }

    // 3) السماح بالإلغاء فقط إذا كان status = 'pending'
    if (order.status !== "pending") {
      return res
        .status(400)
        .json({ message: "Only pending orders can be cancelled" });
    }

    // 4) (اختياري) منع إلغاء الطلب المدفوع
    if (order.payment_status === "paid") {
      return res
        .status(400)
        .json({ message: "Paid orders cannot be cancelled" });
    }

    // 5) تحديث حالة الطلب إلى cancelled
    await pool.query(
      "UPDATE orders SET status = ?, updated_at = CURRENT_TIMESTAMP WHERE id = ?",
      ["cancelled", orderId]
    );

    res.json({
      message: "Order cancelled successfully",
      order_id: orderId,
      new_status: "cancelled",
    });
  } catch (err) {
    console.error("Cancel Order Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};
