"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoute = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const router = express_1.default.Router();
router.post("/create-payment-intent", subscription_controller_1.subscriptionController.handleCreatePaymentIntent);
// Routes for Stripe API
// router.post("/create-customer", subscriptionController.createCustomer);
// router.post("/create-checkout-session", subscriptionController.createCheckoutSession);
// router.post("/webhook", subscriptionController.handleWebhook);
exports.subscriptionRoute = router;
