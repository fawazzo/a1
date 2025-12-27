import { pool } from "../config/db.js";

/*
|--------------------------------------------------------------------------
| 1) إضافة عنصر إلى السلة (Add to Cart)
|--------------------------------------------------------------------------
*/
export const addToCart = async (req, res) => {
  const userId = req.user.id;
  const { restaurant_id, dish_id, quantity } = req.body;

  try {
    // 1️⃣ هل يوجد سلة حالياً للمستخدم؟
    const [existingCart] = await pool.query(
      "SELECT * FROM cart WHERE user_id = ?",
      [userId]
    );

    let cartId;

    if (existingCart.length > 0) {
      const cart = existingCart[0];

      // 2️⃣ إذا كانت السلة موجودة ولكن من مطعم آخر → نحذفها
      if (cart.restaurant_id !== restaurant_id) {
        await pool.query("DELETE FROM cart_items WHERE cart_id = ?", [cart.id]);
        await pool.query("DELETE FROM cart WHERE id = ?", [cart.id]);

        // إنشاء سلة جديدة
        const [newCart] = await pool.query(
          "INSERT INTO cart (user_id, restaurant_id) VALUES (?, ?)",
          [userId, restaurant_id]
        );

        cartId = newCart.insertId;
      } else {
        // إذا كان نفس المطعم → نستخدم نفس السلة
        cartId = cart.id;
      }
    } else {
      // 3️⃣ إذا لا توجد سلة إطلاقاً → أنشئ واحدة جديدة
      const [newCart] = await pool.query(
        "INSERT INTO cart (user_id, restaurant_id) VALUES (?, ?)",
        [userId, restaurant_id]
      );
      cartId = newCart.insertId;
    }

    // 4️⃣ الآن نفحص هل الطبق موجود داخل نفس السلة
    const [existingItem] = await pool.query(
      "SELECT * FROM cart_items WHERE cart_id = ? AND dish_id = ?",
      [cartId, dish_id]
    );

    if (existingItem.length > 0) {
      // تحديث الكمية فقط
      await pool.query(
        "UPDATE cart_items SET quantity = quantity + ? WHERE id = ?",
        [quantity, existingItem[0].id]
      );
    } else {
      // إضافة طبق جديد للسلة
      await pool.query(
        "INSERT INTO cart_items (cart_id, dish_id, quantity) VALUES (?, ?, ?)",
        [cartId, dish_id, quantity]
      );
    }

    return res.json({
      message: "Item added to cart",
      cart_id: cartId,
    });

  } catch (err) {
    console.error(err);
    return res.status(500).json({ message: "Server error" });
  }
};

/*
|--------------------------------------------------------------------------
| 2) جلب السلة الخاصة بالمستخدم (Get Cart)
|--------------------------------------------------------------------------
*/
export const getCart = async (req, res) => {
  const userId = req.user.id;

  try {
    // 1️⃣ الحصول على سلة المستخدم
    const [cartRows] = await pool.query(
      "SELECT * FROM cart WHERE user_id = ? LIMIT 1",
      [userId]
    );

    if (cartRows.length === 0) {
      return res.json({
        cart_id: null,
        items: [],
        total: 0
      });
    }

    const cart = cartRows[0];

    // 2️⃣ جلب عناصر السلة مع بيانات الطبق
    const [items] = await pool.query(
      `SELECT 
          ci.id AS item_id,
          ci.quantity,
          d.id AS dish_id,
          d.name,
          d.price
        FROM cart_items ci
        JOIN dishes d ON ci.dish_id = d.id
        WHERE ci.cart_id = ?`,
      [cart.id]
    );

    // 3️⃣ حساب total و subtotal لكل عنصر
    let total = 0;

    const formattedItems = items.map((item) => {
      const subtotal = item.price * item.quantity;
      total += subtotal;

      return {
        id: item.item_id,
        dish_id: item.dish_id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        subtotal
      };
    });

    // 4️⃣ إرجاع النتيجة
    res.json({
      cart_id: cart.id,
      items: formattedItems,
      total
    });

  } catch (err) {
    console.error(err);
    res.status(500).json({ message: "Server error" });
  }
};
/*
|--------------------------------------------------------------------------
| 3) تعديل كمية عنصر في السلة (Update Quantity)
|--------------------------------------------------------------------------
*/
export const updateCartItem = async (req, res) => {
  try {
    const { itemId, quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Quantity must be greater than 0" });
    }

    await pool.query(
      "UPDATE cart_items SET quantity = ? WHERE id = ?",
      [quantity, itemId]
    );

    res.json({ message: "Item quantity updated" });

  } catch (error) {
    console.error("UpdateCartItem Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};



/*
|--------------------------------------------------------------------------
| 4) حذف عنصر من السلة (Remove Cart Item)
|--------------------------------------------------------------------------
*/
export const removeCartItem = async (req, res) => {
  try {
    const { itemId } = req.params;

    await pool.query(
      "DELETE FROM cart_items WHERE id = ?",
      [itemId]
    );

    res.json({ message: "Item removed from cart" });

  } catch (error) {
    console.error("RemoveCartItem Error:", error);
    res.status(500).json({ message: "Server error" });
  }
};
