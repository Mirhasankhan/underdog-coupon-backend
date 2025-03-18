import express from "express";
import validateRequest from "../../middlewares/validateRequest";
import { userValidation } from "./user.validation";
import { UserControllers } from "./user.controller";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  validateRequest(userValidation.userRegisterValidationSchema),
  UserControllers.createUser
);
router.get("/", auth(UserRole.ADMIN), UserControllers.getUsers);
// router.get("/locations", UserControllers.getUserLocations);
router.get("/currentUser", auth(), UserControllers.getSingleUser);
router.get("/user/notifications", auth(), UserControllers.getNotifications);
// router.get("/location/:id", UserControllers.getUserLocation);
router.put(
  "/update",
  validateRequest(userValidation.userUpdateValidationSchema),
  auth(),
  UserControllers.updateUser
);

export const userRoutes = router;
