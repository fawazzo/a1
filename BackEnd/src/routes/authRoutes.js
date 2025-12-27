// Yönlendirici dosyaları oluşturuluyor
import express from "express";
import { register, login, getMe } from "../controllers/authController.js";
import { authRequired } from "../middleware/auth.js";


const router = express.Router();

router.post("/register", register);
router.post("/login", login);
router.get("/me", authRequired, getMe);


export default router;

