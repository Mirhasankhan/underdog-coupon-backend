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
router.get("/:id", auth(), UserControllers.getSingleUser);
// router.get("/location/:id", UserControllers.getUserLocation);
// router.put("/:id", validateRequest(userValidation.userUpdateValidationSchema),auth(UserRole.ADMIN), UserControllers.updateUser);
// router.put("/:id", validateRequest(userValidation.userUpdateValidationSchema),auth(UserRole.ADMIN), UserControllers.createUser);
// router.delete("/:id", auth(UserRole.ADMIN), UserControllers.deleteUser);

export const userRoutes = router;
