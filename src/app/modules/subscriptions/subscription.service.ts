import Stripe from "stripe";
import prisma from "../../../prisma/prismaClient";
import config from "../../../config";
import getRandomItems from "../../../helpers/gerRandomItems";
import ApiError from "../../../errors/ApiErrors";
import { Card, CouponPlan } from "@prisma/client";

const stripe = new Stripe(config.stripe.stripe_secret as string);

// Create a new Stripe customer
// const createCustomer = async (
//   email: string,
//   userName: string,
//   password: string
// ) => {
//   const customer = await stripe.customers.create({
//     email,
//     name: userName,
//   });
//   await prisma.user.create({
//     data: {
//       email,
//       userName,
//       password,
//       // stripeCustomerId: customer.id,
//     },
//   });

//   return customer;
// };

// const createCheckoutSession = async (customerId: string, priceId: string) => {
//   const session = await stripe.checkout.sessions.create({
//     payment_method_types: ["card"],
//     mode: "subscription",
//     customer: customerId,
//     line_items: [
//       {
//         price: priceId,
//         quantity: 1,
//       },
//     ],
//     success_url:
//       "http://localhost:3000/success?session_id={CHECKOUT_SESSION_ID}",
//     cancel_url: "http://localhost:3000/cancel",
//   });

//   return session;
// };
// // Handle Stripe webhook events
// const handleWebhook = async (event) => {
//   switch (event.type) {
//     case "checkout.session.completed": {
//       // const session = event.data.object;
//       // await prisma.user.update({
//       //   where: { stripeCustomerId: session.customer },
//       //   data: { subscriptionStatus: "active" },
//       // });
//       console.log("completed,active");
//       break;
//     }
//     case "customer.subscription.deleted": {
//       console.log("Deleted,active");
//       break;
//     }
//   }
// };

const createPaymentIntent = async (userId: string, planType: CouponPlan) => {
  const existingSubscription = await prisma.payment.findFirst({
    where: { userId: userId },
  });
  if (existingSubscription) {
    throw new ApiError(401, "You have already subscribed this plan");
  }
  if (!planType) {
    throw new ApiError(401, "Plantype wasn't provided.");
  }

  const amount = planType == "BASIC" ? 10 : 20;
  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });

  const planCoupons = await prisma.coupon.findMany({
    where: {
      plan: planType,
      activeTo: { gte: new Date() },
    },
  });

  if (planCoupons.length === 0) {
    throw new ApiError(400, "No valid coupons available.");
  }

  const validCoupons = planCoupons.filter(
    (coupon) => coupon.used < coupon.limitNumber
  );

  if (validCoupons.length === 0) {
    throw new ApiError(400, "No valid coupons left that meet the criteria.");
  }

  let randomCoupons: any[] = [];
  while (randomCoupons.length < 5) {
    randomCoupons = randomCoupons.concat(getRandomItems(validCoupons, 1));
  }

  randomCoupons = randomCoupons.slice(0, 5);

  const couponCountMap = randomCoupons.reduce(
    (acc: { [key: string]: number }, coupon) => {
      acc[coupon.id] = (acc[coupon.id] || 0) + 1;
      return acc;
    },
    {}
  );

  const updatedCoupons = Object.keys(couponCountMap).map((couponId) => {
    return prisma.coupon.update({
      where: { id: couponId },
      data: {
        used: {
          increment: couponCountMap[couponId],
        },
      },
    });
  });

  await Promise.all(updatedCoupons);

  const paymentRecord = await prisma.payment.create({
    data: {
      amount: amount,
      currency: "usd",
      stripeId: paymentIntent.id,
      userId: userId,
      planType: planType,
      codes: randomCoupons.map((coupon) => coupon.code),
    },
  });

  await prisma.user.update({
    where: { id: userId },
    data: { isSubscribed: true },
  });
  await prisma.notification.create({
    data: {
      userId: userId,
      message: "Your payment is successfull.",
    },
  });

  return {
    clientSecret: paymentIntent.client_secret,
    paymentRecord,
  };
};

const getSubscriptionFromDB = async (userId: string) => {
  const subscription = await prisma.payment.findFirst({
    where: { userId: userId },
  });
  if (!subscription) {
    throw new ApiError(404, "Subscription Not Found");
  }
  return subscription;
};

const addCardIntoDB = async (userId: string, payload: Card) => {
  const existingCard = await prisma.card.findUnique({
    where: { cardNumber: payload.cardNumber },
  });
  if (existingCard) {
    throw new ApiError(401, "This card is already included");
  }

  const newCard = await prisma.card.create({
    data: {
      ...payload,
      userId,
    },
  });

  return {
    newCard,
  };
};

const getCardsFromDb = async (userId: string) => {
  const cards = await prisma.card.findMany({
    where: { userId: userId },
  });
  if (!cards) {
    throw new ApiError(404, "No Card Found");
  }
  return cards;
};

export const subscriptionServices = {
  // createCheckoutSession,
  // createCustomer,  
  createPaymentIntent,
  getSubscriptionFromDB,
  addCardIntoDB,
  getCardsFromDb,
};
