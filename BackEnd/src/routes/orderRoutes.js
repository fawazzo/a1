import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
    createOrder,
    getMyOrders,
    getOrderDetails,
    getSellerOrders,
    updateOrderStatus,
    updatePaymentStatus,
    cancelOrder
} from "../controllers/orderController.js";


const router = Router();

/**
 * @swagger
 * /api/orders/create:
 *   post:
 *     summary: Create a new order from cart
 *     tags: [Orders]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - payment_method
 *               - delivery_address
 *             properties:
 *               payment_method:
 *                 type: string
 *                 enum: [cash, online]
 *                 example: online
 *               delivery_address:
 *                 type: string
 *                 example: Istanbul / Besiktas
 *               delivery_fee:
 *                 type: number
 *                 example: 20
 *     responses:
 *       200:
 *         description: Order created successfully
 *       400:
 *         description: Cart is empty or invalid input
 *       401:
 *         description: Unauthorized
 *       500:
 *         description: Server error
 */

// Create order (User only)
router.post("/create", authRequired, createOrder);

// Get user's orders
router.get("/", authRequired, getMyOrders);

// Get all orders for seller (مطاعم البائع)
router.get("/seller/all", authRequired, getSellerOrders);

//  Update order status (Seller only)
router.patch("/:id/status", authRequired, updateOrderStatus);

//  Update payment status (pending / paid / failed)
router.patch("/:id/payment", authRequired, updatePaymentStatus);

//  Cancel order (User only, pending orders)
router.patch("/:id/cancel", authRequired, cancelOrder);

// Get order details (for user الذي يملك الطلب)
router.get("/:id", authRequired, getOrderDetails);


export default router;

