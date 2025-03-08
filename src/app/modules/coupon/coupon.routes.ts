import express from "express";
import { couponController } from "./coupon.controller";
import validateRequest from "../../middlewares/validateRequest";
import { couponValidation } from "./coupon.validation";
import auth from "../../middlewares/auth";
import { UserRole } from "@prisma/client";

const router = express.Router();

router.post(
  "/create",
  auth(UserRole.ADMIN),
  validateRequest(couponValidation.couponValidationSchema),
  couponController.createCoupon
);
router.get("/", couponController.getCoupons);
router.delete("/delete/:id", auth(UserRole.ADMIN), couponController.deleteCoupon);

export const couponRoutes = router;
