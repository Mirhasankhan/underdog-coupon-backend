"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.subscriptionController = void 0;
const subscription_service_1 = require("./subscription.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const stripe_1 = __importDefault(require("stripe"));
const config_1 = __importDefault(require("../../../config"));
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const stripe = new stripe_1.default(config_1.default.stripe.stripe_secret);
const handleCreatePaymentIntent = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { planType } = req.body;
    const userId = req.user.id;
    const paymentData = yield subscription_service_1.subscriptionServices.createPaymentIntent(userId, planType);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subscription Successfull",
        data: paymentData,
    });
});
const getSubscription = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const subscriptionData = yield subscription_service_1.subscriptionServices.getSubscriptionFromDB(userId);
    (0, sendResponse_1.default)(res, {
        statusCode: 200,
        success: true,
        message: "Subscription Retrieved Successfully",
        data: subscriptionData,
    });
});
const addNewCard = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield subscription_service_1.subscriptionServices.addCardIntoDB(userId, req.body);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Card Added successfully",
        data: result,
    });
}));
const getCards = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const userId = req.user.id;
    const result = yield subscription_service_1.subscriptionServices.getCardsFromDb(userId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Card Retrieved successfully",
        data: result,
    });
}));
// Create a new Stripe customer
// const createCustomer = async (req: Request, res: Response) => {
//   const { email, userName,password } = req.body;
//   try {
//     const customer = await subscriptionServices.createCustomer(email, userName,password);
//     res.json({ customerId: customer.id });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// Create a checkout session for subscription
// const createCheckoutSession = async (req: Request, res: Response) => {
//   const { customerId, priceId } = req.body; // priceId from Stripe dashboard
//   try {
//     const session = await subscriptionServices.createCheckoutSession(
//       customerId,
//       priceId
//     );
//     res.json({ sessionId: session.id });
//   } catch (error: any) {
//     res.status(500).json({ error: error.message });
//   }
// };
// Handle Stripe webhook events
// const handleWebhook = async (req: Request, res: Response) => {
//   const sig = req.headers["stripe-signature"];
//   if (typeof sig !== "string") {
//     return res.status(400).send("Webhook signature missing or invalid.");
//   }
//   let event;
//   try {
//     event = stripe.webhooks.constructEvent(
//       req.body,
//       sig,
//       config.stripe.stripe_secret as string
//     );
//     await subscriptionServices.handleWebhook(event);
//     res.json({ received: true });
//   } catch (err: any) {
//     return res.status(400).send(`Webhook Error: ${err.message}`);
//   }
// };
exports.subscriptionController = {
    handleCreatePaymentIntent,
    getSubscription,
    addNewCard,
    getCards
    // handleWebhook,
    // createCheckoutSession,
    // createCustomer
};
