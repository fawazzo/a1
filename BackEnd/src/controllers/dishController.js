import { pool } from "../config/db.js";

// إضافة طبق جديد
export async function addDish(req, res) {
  try {
    const sellerId = req.user.id;
    const restaurantId = req.params.id;
    const { name, description, price, image, category, is_available } = req.body;

    // تحقق أن المطعم يعود للبائع
    const [restaurant] = await pool.query(
      "SELECT seller_id FROM restaurants WHERE id = ?",
      [restaurantId]
    );

    if (restaurant.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    if (restaurant[0].seller_id !== sellerId) {
      return res.status(403).json({ message: "Not allowed" });
    }

    const [result] = await pool.query(
      `INSERT INTO dishes (restaurant_id, name, description, price, image, category, is_available)
       VALUES (?, ?, ?, ?, ?, ?, ?)`,
      [restaurantId, name, description, price, image, category, is_available]
    );

    res.status(201).json({
      message: "Dish added",
      dishId: result.insertId,
    });

  } catch (err) {
    console.error("Add dish error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// تعديل طبق
export async function updateDish(req, res) {
  try {
    const sellerId = req.user.id;
    const dishId = req.params.dishId;

    const { name, description, price, image, category, is_available } = req.body;

    // تحقق ملكية الطبق
    const [owner] = await pool.query(
      `SELECT d.restaurant_id, r.seller_id
       FROM dishes d
       JOIN restaurants r ON d.restaurant_id = r.id
       WHERE d.id = ?`,
      [dishId]
    );

    if (owner.length === 0)
      return res.status(404).json({ message: "Dish not found" });

    if (owner[0].seller_id !== sellerId)
      return res.status(403).json({ message: "Not allowed" });

    await pool.query(
      `UPDATE dishes SET name=?, description=?, price=?, image=?, category=?, is_available=? WHERE id=?`,
      [name, description, price, image, category, is_available, dishId]
    );

    res.json({ message: "Dish updated" });

  } catch (err) {
    console.error("Update dish error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// حذف طبق
export async function deleteDish(req, res) {
  try {
    const sellerId = req.user.id;
    const dishId = req.params.dishId;

    const [owner] = await pool.query(
      `SELECT d.restaurant_id, r.seller_id
       FROM dishes d
       JOIN restaurants r ON d.restaurant_id = r.id
       WHERE d.id = ?`,
      [dishId]
    );

    if (owner.length === 0)
      return res.status(404).json({ message: "Dish not found" });

    if (owner[0].seller_id !== sellerId)
      return res.status(403).json({ message: "Not allowed" });

    await pool.query("DELETE FROM dishes WHERE id=?", [dishId]);

    res.json({ message: "Dish deleted" });

  } catch (err) {
    console.error("Delete dish error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// جلب جميع أطباق مطعم
export async function getRestaurantDishes(req, res) {
  try {
    const restaurantId = req.params.id;

    const [rows] = await pool.query(
      "SELECT id, name, description, price, image, category, is_available FROM dishes WHERE restaurant_id = ?",
      [restaurantId]
    );

    res.json(rows);

  } catch (err) {
    console.error("Get dishes error:", err);
    res.status(500).json({ message: "Server error" });
  }
}

// جلب طبق واحد
export async function getDishById(req, res) {
  try {
    const dishId = req.params.dishId;

    const [rows] = await pool.query(
      "SELECT * FROM dishes WHERE id = ?",
      [dishId]
    );

    if (rows.length === 0)
      return res.status(404).json({ message: "Dish not found" });

    res.json(rows[0]);

  } catch (err) {
    console.error("Get dish error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
