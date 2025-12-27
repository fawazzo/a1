import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import { payOrder } from "../controllers/paymentController.js";

const router = Router();

// دفع وهمي للطلب (online only)
router.post("/pay/:orderId", authRequired, payOrder);

export default router;
