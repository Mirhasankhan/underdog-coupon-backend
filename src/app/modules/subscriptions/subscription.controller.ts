import { Request, Response } from "express";
import { subscriptionServices } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";
import Stripe from "stripe";
import config from "../../../config";
import catchAsync from "../../../shared/catchAsync";

const stripe = new Stripe(config.stripe.stripe_secret as string);

const handleCreatePaymentIntent = async (req: Request, res: Response) => {
  const { planType } = req.body;
  const userId = req.user.id;
  const paymentData = await subscriptionServices.createPaymentIntent(
    userId,
    planType
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription Successfull",
    data: paymentData,
  });
};
const getSubscription = async (req: Request, res: Response) => {
  const userId = req.user.id;
  const subscriptionData = await subscriptionServices.getSubscriptionFromDB(
    userId
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription Retrieved Successfully",
    data: subscriptionData,
  });
};

const addNewCard = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await subscriptionServices.addCardIntoDB(userId, req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Card Added successfully",
    data: result,
  });
});
const getCards = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id;
  const result = await subscriptionServices.getCardsFromDb(userId);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Card Retrieved successfully",
    data: result,
  });
});

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

export const subscriptionController = {
  handleCreatePaymentIntent,
  getSubscription,
  addNewCard,
  getCards
  // handleWebhook,
  // createCheckoutSession,
  // createCustomer
};
