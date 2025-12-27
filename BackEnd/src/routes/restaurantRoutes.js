import { Router } from "express";
import { 
  getRestaurants, 
  getRestaurantById, 
  getRestaurantDishes,
  addRestaurant 
} from "../controllers/restaurantController.js";
import { authRequired } from "../middleware/auth.js";

const router = Router();

// CREATE RESTAURANT → Only Seller
router.post("/", authRequired, addRestaurant);

// GET ALL RESTAURANTS
router.get("/", getRestaurants);

// GET ONE RESTAURANT
router.get("/:id", getRestaurantById);

// GET DISHES OF RESTAURANT
router.get("/:id/dishes", getRestaurantDishes);

export default router;
