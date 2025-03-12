"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionRoute = void 0;
const express_1 = __importDefault(require("express"));
const subscription_controller_1 = require("./subscription.controller");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const subscription_validation_1 = require("./subscription.validation");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const router = express_1.default.Router();
router.post("/create-payment-intent", (0, auth_1.default)(), subscription_controller_1.subscriptionController.handleCreatePaymentIntent);
router.get("/subscription", (0, auth_1.default)(), subscription_controller_1.subscriptionController.getSubscription);
router.post("/addCard", (0, auth_1.default)(), (0, validateRequest_1.default)(subscription_validation_1.subscriptionValidation.cardZodSchema), subscription_controller_1.subscriptionController.addNewCard);
router.get("/cards", (0, auth_1.default)(), subscription_controller_1.subscriptionController.getCards);
// Routes for Stripe API
// router.post("/create-customer", subscriptionController.createCustomer);
// router.post("/create-checkout-session", subscriptionController.createCheckoutSession);
// router.post("/webhook", subscriptionController.handleWebhook);
exports.subscriptionRoute = router;
