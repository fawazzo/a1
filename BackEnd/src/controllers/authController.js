import bcrypt from "bcrypt";
import jwt from "jsonwebtoken";
import { pool } from "../config/db.js";

// CREATE JWT
const generateToken = (user) => {
    return jwt.sign(
        { id: user.id, email: user.email },
        process.env.JWT_SECRET,
        { expiresIn: process.env.JWT_EXPIRES_IN }
    );
};

// REGISTER
export const register = async (req, res) => {
    try {
        const { name, email, password, phone, address, city, is_seller } = req.body;

        // check if user exists
        const [exists] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (exists.length > 0) {
            return res.status(400).json({ message: "Email already exists" });
        }

        // hash password
        const hashedPassword = await bcrypt.hash(password, 10);

        // insert user
        const [result] = await pool.query(
            `INSERT INTO users (name, email, password, phone, address, city, is_seller)
             VALUES (?, ?, ?, ?, ?, ?, ?)`,
            [name, email, hashedPassword, phone, address, city, is_seller || 0]
        );

        // create token
        const token = generateToken({ id: result.insertId, email });

        res.status(201).json({
            message: "User registered successfully",
            token,
            user: {
                id: result.insertId,
                name,
                email,
                phone,
                address,
                city,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// LOGIN
export const login = async (req, res) => {
    try {
        const { email, password } = req.body;

        // check user
        const [rows] = await pool.query("SELECT * FROM users WHERE email = ?", [email]);
        if (rows.length === 0) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        const user = rows[0];

        // compare password
        const isMatch = await bcrypt.compare(password, user.password);
        if (!isMatch) {
            return res.status(400).json({ message: "Invalid email or password" });
        }

        // generate token
        const token = generateToken(user);

        res.json({
            message: "Login successful",
            token,
            user: {
                id: user.id,
                name: user.name,
                email: user.email,
                phone: user.phone,
                address: user.address,
                city: user.city,
            },
        });

    } catch (err) {
        console.error(err);
        res.status(500).json({ message: "Server error" });
    }
};

// GET CURRENT USER
export const getMe = async (req, res) => {
    try {
        const userId = req.user.id;

        const [rows] = await pool.query(
            "SELECT id, name, email, phone, address, city FROM users WHERE id = ?",
            [userId]
        );

        if (rows.length === 0) {
            return res.status(404).json({ message: "User not found" });
        }

        res.json(rows[0]);
    } catch (err) {
        res.status(500).json({ message: "Server error" });
    }
};
