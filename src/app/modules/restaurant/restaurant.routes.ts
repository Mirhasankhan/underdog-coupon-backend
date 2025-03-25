import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";
import { restaurantValidation } from "./restaurant.validation";
import { restaurantController } from "./restaurant.controller";
import { fileUploader } from "../../../helpers/fileUploadHelper";
import { parseBodyData } from "../../middlewares/parseBodyData";

const router = express.Router();

router.post(
  "/create/test",
  // auth(UserRole.ADMIN),
  fileUploader.uploadMultiple,
  parseBodyData,
  // validateRequest(restaurantValidation.restaurantValidationSchema),
  restaurantController.createRestaurant
);
// router.post(
//   "/send-notification",
//   auth(),
//   restaurantController.sendNotification
// );
router.get("/", restaurantController.getRestaurants);
router.delete(
  "/delete/:id",
  auth(UserRole.ADMIN),
  restaurantController.deleteRestarant
);
router.put(
  "/update/:id",
  fileUploader.uploadMultiple,
  parseBodyData,
  validateRequest(restaurantValidation.updateRestaurantValidationSchema),
  restaurantController.updateRestaurant
);

export const restaurantRoutes = router;
