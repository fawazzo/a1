import { pool } from "../config/db.js";

// POST /api/payments/pay/:orderId
// Body: { "success": true }  أو  { "success": false }
export const payOrder = async (req, res) => {
  try {
    // 1) نجيب userId من التوكن (JWT)
    const userId = req.user.id;

    // 2) نجيب orderId من الرابط
    const { orderId } = req.params;

    // 3) نجيب success من body
    // success = true يعني الدفع نجح
    // success = false يعني فشل
    const { success } = req.body;

    // تحقق سريع: لازم success يكون Boolean
    if (typeof success !== "boolean") {
      return res.status(400).json({ message: "success must be true or false" });
    }

    // 4) نجيب الطلب ونتأكد أنه تابع لهذا المستخدم
    const [orders] = await pool.query(
      "SELECT * FROM orders WHERE id = ? AND user_id = ?",
      [orderId, userId]
    );

    if (orders.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    const order = orders[0];

    // 5) لازم الطلب يكون online
    if (order.payment_method !== "online") {
      return res.status(400).json({
        message: "This order is not online payment"
      });
    }

    // 6) لازم الدفع يكون pending حتى نقدر ندفع
    if (order.payment_status !== "pending") {
      return res.status(400).json({
        message: "Payment already processed",
        current_status: order.payment_status
      });
    }

    // 7) نحدد الحالة الجديدة
    const newStatus = success ? "paid" : "failed";

    // 8) نحدث جدول orders
    await pool.query(
      "UPDATE orders SET payment_status = ? WHERE id = ?",
      [newStatus, orderId]
    );

    // 9) نرجع الرد
    return res.json({
      message: success ? "Payment successful" : "Payment failed",
      order_id: Number(orderId),
      payment_status: newStatus
    });

  } catch (err) {
    console.error("payOrder error:", err);
    return res.status(500).json({ message: "Server error" });
  }
};
