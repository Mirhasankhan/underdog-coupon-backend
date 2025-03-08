import express from "express";
import { subscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";

const router = express.Router();

router.post(
  "/create-payment-intent", 
  subscriptionController.handleCreatePaymentIntent
);
// Routes for Stripe API
// router.post("/create-customer", subscriptionController.createCustomer);
// router.post("/create-checkout-session", subscriptionController.createCheckoutSession);
// router.post("/webhook", subscriptionController.handleWebhook);

export const subscriptionRoute = router;
