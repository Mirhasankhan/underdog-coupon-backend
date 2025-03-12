import express from "express";
import { authController } from "./auth.controller";
import auth from "../../middlewares/auth";
import validateRequest from "../../middlewares/validateRequest";
import { authValidation } from "./auth.validation";

const router = express.Router();

//login user
router.post(
  "/login",
  validateRequest(authValidation.authLoginSchema),
  authController.loginUser
);
router.post(
  "/googleLogin",
  validateRequest(authValidation.authLoginSchema),
  authController.googleLogin
);
router.post("/send-otp", authController.sendForgotPasswordOtp);
router.post("/verify-otp", authController.verifyForgotPasswordOtpCode);
router.patch("/reset-password", auth(), authController.resetPassword);
router.patch("/change-password", auth(), authController.changePassword);

export const authRoute = router;
