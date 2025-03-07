import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { restaurantValidation } from "./restaurant.validation";
import { restaurantController } from "./restaurant.controller";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  validateRequest(restaurantValidation.restaurantValidationSchema),
  restaurantController.createRestaurant
);
router.get("/", auth(UserRole.ADMIN), restaurantController.getRestaurants);
router.delete(
  "/delete/:id",
  auth(UserRole.ADMIN),
  restaurantController.deleteRestarant
);
router.put(
  "/update/:id",
  validateRequest(restaurantValidation.updateRestaurantValidationSchema),
  restaurantController.updateRestaurant
);

export const restaurantRoutes = router;
