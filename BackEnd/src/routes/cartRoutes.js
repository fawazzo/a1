import { Router } from "express";//API’nin sadece bu bölümüne ait route’ları (yolları) oluşturmak için Router kullanırız
import { authRequired } from "../middleware/auth.js";//Sepetle ilgili herhangi bir işlem, kullanıcının giriş yapmış olmasını gerektirir;
//bu yüzden Token doğrulama middleware’ini kullanırız.

// نقوم باستيراد دوال التحكم الخاصة بالسلة (سنكتبها لاحقًا)
import {//Dört fonksiyonun içe aktarılması
    addToCart,
    getCart,
    updateCartItem,
    removeCartItem
} from "../controllers/cartController.js";

const router = Router();

// 1) إضافة طبق إلى السلة Add to Cart

router.post("/add", authRequired, addToCart);

// 2) الحصول على سلة المستخدم الحالية Get Cart

router.get("/", authRequired, getCart);

// 3) تعديل كمية عنصر داخل السلة Update Quantity

router.patch("/update", authRequired, updateCartItem);

// 4) حذف عنصر من السلة Remove Item

router.delete("/remove/:itemId", authRequired, removeCartItem); //cart_items tablosu içinde itemId kullanarak bir öğeyi silmek için

export default router;
