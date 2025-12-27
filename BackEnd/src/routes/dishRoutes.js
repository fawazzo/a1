import { Router } from "express";
import { authRequired } from "../middleware/auth.js";
import {
  addDish,
  updateDish,
  deleteDish,
  getRestaurantDishes,
  getDishById
} from "../controllers/dishController.js";

const router = Router();

// seller only
router.post("/restaurants/:id/dishes", authRequired, addDish);
router.put("/dishes/:dishId", authRequired, updateDish);
router.delete("/dishes/:dishId", authRequired, deleteDish);

// public
router.get("/restaurants/:id/dishes", getRestaurantDishes);
router.get("/dishes/:dishId", getDishById);

export default router;
