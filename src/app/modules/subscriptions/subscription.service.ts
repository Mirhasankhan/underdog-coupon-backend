import Stripe from "stripe";
import prisma from "../../../prisma/prismaClient";
import config from "../../../config";
import getRandomItems from "../../../helpers/gerRandomItems";
import ApiError from "../../../errors/ApiErrors";
import { CouponPlan } from "@prisma/client";

const stripe = new Stripe(config.stripe.stripe_secret as string);

export const createPaymentIntent = async (
  userId: string,
  planType: CouponPlan
) => {
  if(!planType){
    throw new ApiError(401,"Plantype wasn't provided.")
  }
  const amount = planType == "BASIC" ? 10 : 20;

  const paymentIntent = await stripe.paymentIntents.create({
    amount: amount * 100,
    currency: "usd",
    payment_method_types: ["card"],
  });

  const planCoupons = await prisma.coupon.findMany({
    where: { plan: planType },
  });

  const randomCoupons = getRandomItems(planCoupons, 5);

  const updatedCoupons = randomCoupons.map((coupon) => {
    return prisma.coupon.update({
      where: { id: coupon.id },
      data: {
        used: coupon.used + 1,
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
      planType:planType,
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
  createPaymentIntent,
};
