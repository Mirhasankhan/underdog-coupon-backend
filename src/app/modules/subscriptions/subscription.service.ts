import Stripe from "stripe";
import prisma from "../../../prisma/prismaClient";
import config from "../../../config";
import getRandomItems from "../../../helpers/gerRandomItems";
import ApiError from "../../../errors/ApiErrors";
import { CouponPlan } from "@prisma/client";

const stripe = new Stripe(config.stripe.stripe_secret as string);

// export const createPaymentIntent = async (
//   userId: string,
//   planType: CouponPlan
// ) => {
//   if (!planType) {
//     throw new ApiError(401, "Plantype wasn't provided.");
//   }
//   const amount = planType == "BASIC" ? 10 : 20;

//   const paymentIntent = await stripe.paymentIntents.create({
//     amount: amount * 100,
//     currency: "usd",
//     payment_method_types: ["card"],
//   });

//   const planCoupons = await prisma.coupon.findMany({
//     where: { plan: planType },
//   });

//   const randomCoupons = getRandomItems(planCoupons, 5);

//   const updatedCoupons = randomCoupons.map((coupon) => {
//     return prisma.coupon.update({
//       where: { id: coupon.id },
//       data: {
//         used: coupon.used + 1,
//       },
//     });
//   });

//   await Promise.all(updatedCoupons);

//   const paymentRecord = await prisma.payment.create({
//     data: {
//       amount: amount,
//       currency: "usd",
//       stripeId: paymentIntent.id,
//       userId: userId,
//       planType: planType,
//       codes: randomCoupons.map((coupon) => coupon.code),
//     },
//   });
//   return {
//     clientSecret: paymentIntent.client_secret,
//     paymentRecord,
//     randomCoupons,
//   };
// };

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

//   // Store customer in database
//   await prisma.user.create({
//     data: {
//       email,
//       userName,
//       password,
//       stripeCustomerId: customer.id,
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
// Handle Stripe webhook events
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

export const createPaymentIntent = async (
  userId: string,
  planType: CouponPlan
) => {
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

  const validCoupons = planCoupons.filter(coupon => coupon.used < coupon.limitNumber);

  if (validCoupons.length === 0) {
    throw new ApiError(400, "No valid couponss left that meet the criteria.");
  }

  let randomCoupons: any[] = [];
  while (randomCoupons.length < 5) {
    randomCoupons = randomCoupons.concat(getRandomItems(validCoupons, 1)); 
  }

  randomCoupons = randomCoupons.slice(0, 5);
 
  const couponCountMap = randomCoupons.reduce((acc: { [key: string]: number }, coupon) => {
    acc[coupon.id] = (acc[coupon.id] || 0) + 1;
    return acc;
  }, {});

  const updatedCoupons = Object.keys(couponCountMap).map((couponId) => {
    return prisma.coupon.update({
      where: { id: couponId },
      data: {
        used: { 
          increment: couponCountMap[couponId]  
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

  return {
    clientSecret: paymentIntent.client_secret,
    paymentRecord,
    randomCoupons,
  };
};




export const subscriptionServices = {
  // createCheckoutSession,
  // createCustomer,
  // handleWebhook,
  createPaymentIntent,
};
