import { pool } from "../config/db.js";


// ============================
// 1) Create Restaurant (Seller Only)
// ============================
export const addRestaurant = async (req, res) => {
  try {
    const sellerId = req.user.id;

    // Check if user is a seller
    const [user] = await pool.query(
      "SELECT is_seller FROM users WHERE id = ?",
      [sellerId]
    );

    if (user.length === 0) {
      return res.status(404).json({ message: "User not found" });
    }

    if (user[0].is_seller !== 1) {
      return res.status(403).json({ message: "Only sellers can create a restaurant" });
    }

    const { name, cuisine, description, address, phone, image, rating, delivery_time_min, delivery_time_max, min_order, delivery_fee} = req.body;

    const [result] = await pool.query(
      `INSERT INTO restaurants 
       (seller_id, name, cuisine, description, address, phone, image, rating, delivery_time_min, delivery_time_max, min_order, delivery_fee)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        sellerId,
        name,
        cuisine,
        description,
        address,
        phone,
        image,
        rating || 0,
        delivery_time_min,
        delivery_time_max,
        min_order,
        delivery_fee
      ]
    );

    res.status(201).json({
      message: "Restaurant created successfully",
      restaurant_id: result.insertId
    });

  } catch (err) {
    console.error("Add Restaurant Error:", err);
    res.status(500).json({ message: "Server error" });
  }
};


// ============================
// 2) Get All Restaurants
// ============================
export async function getRestaurants(req, res) {
  try {
    const [rows] = await pool.query(`
      SELECT 
        id,
        name,
        cuisine,
        description,
        address,
        phone,
        image,
        rating,
        delivery_time_min,
        delivery_time_max,
        min_order,
        delivery_fee
      FROM restaurants
    `);

    res.json(rows);
  } catch (err) {
    console.error("Get Restaurants Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}



// ============================
// 3) Get Restaurant By ID
// ============================
export async function getRestaurantById(req, res) {
  try {
    const { id } = req.params;

    const [rows] = await pool.query(`
      SELECT 
        id,
        name,
        cuisine,
        description,
        address,
        phone,
        image,
        rating,
        delivery_time_min,
        delivery_time_max,
        min_order,
        delivery_fee
      FROM restaurants
      WHERE id = ?
    `, [id]);

    if (rows.length === 0) {
      return res.status(404).json({ message: "Restaurant not found" });
    }

    res.json(rows[0]);
  } catch (err) {
    console.error("Get Restaurant Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}


// ============================
// 4) Get Dishes of Restaurant
// ============================
export async function getRestaurantDishes(req, res) {
  try {
    const { id } = req.params;

    const [dishes] = await pool.query(`
      SELECT *
      FROM dishes
      WHERE restaurant_id = ?
    `, [id]);

    res.json(dishes);
  } catch (err) {
    console.error("Get Dishes Error:", err);
    res.status(500).json({ message: "Server error" });
  }
}
