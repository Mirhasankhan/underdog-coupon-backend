import express from "express";
import { subscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-payment-intent", auth(),
  subscriptionController.handleCreatePaymentIntent
);

export const subscriptionRoute = router;
