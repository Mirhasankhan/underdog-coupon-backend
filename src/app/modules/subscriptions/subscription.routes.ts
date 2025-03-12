import express from "express";
import { subscriptionController } from "./subscription.controller";
import auth from "../../middlewares/auth";
import { restaurantValidation } from "../restaurant/restaurant.validation";
import { subscriptionValidation } from "./subscription.validation";
import validateRequest from "../../middlewares/validateRequest";

const router = express.Router();

router.post(
  "/create-payment-intent",
  auth(),
  subscriptionController.handleCreatePaymentIntent
);
router.get("/subscription", auth(), subscriptionController.getSubscription);
router.post("/addCard", auth(),validateRequest(subscriptionValidation.cardZodSchema), subscriptionController.addNewCard);
router.get("/cards", auth(), subscriptionController.getCards);
// Routes for Stripe API
// router.post("/create-customer", subscriptionController.createCustomer);
// router.post("/create-checkout-session", subscriptionController.createCheckoutSession);
// router.post("/webhook", subscriptionController.handleWebhook);

export const subscriptionRoute = router;
