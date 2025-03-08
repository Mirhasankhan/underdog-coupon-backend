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
exports.subscriptionServices = exports.createPaymentIntent = void 0;
const stripe_1 = __importDefault(require("stripe"));
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const config_1 = __importDefault(require("../../../config"));
const gerRandomItems_1 = __importDefault(require("../../../helpers/gerRandomItems"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const stripe = new stripe_1.default(config_1.default.stripe.stripe_secret);
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
const createPaymentIntent = (userId, planType) => __awaiter(void 0, void 0, void 0, function* () {
    if (!planType) {
        throw new ApiErrors_1.default(401, "Plantype wasn't provided.");
    }
    const amount = planType == "BASIC" ? 10 : 20;
    const paymentIntent = yield stripe.paymentIntents.create({
        amount: amount * 100,
        currency: "usd",
        payment_method_types: ["card"],
    });
    const planCoupons = yield prismaClient_1.default.coupon.findMany({
        where: {
            plan: planType,
            activeTo: { gte: new Date() },
        },
    });
    if (planCoupons.length === 0) {
        throw new ApiErrors_1.default(400, "No valid coupons available.");
    }
    const validCoupons = planCoupons.filter(coupon => coupon.used < coupon.limitNumber);
    if (validCoupons.length === 0) {
        throw new ApiErrors_1.default(400, "No valid coupons left that meet the criteria.");
    }
    let randomCoupons = [];
    while (randomCoupons.length < 5) {
        randomCoupons = randomCoupons.concat((0, gerRandomItems_1.default)(validCoupons, 1));
    }
    randomCoupons = randomCoupons.slice(0, 5);
    const couponCountMap = randomCoupons.reduce((acc, coupon) => {
        acc[coupon.id] = (acc[coupon.id] || 0) + 1;
        return acc;
    }, {});
    const updatedCoupons = Object.keys(couponCountMap).map((couponId) => {
        return prismaClient_1.default.coupon.update({
            where: { id: couponId },
            data: {
                used: {
                    increment: couponCountMap[couponId]
                },
            },
        });
    });
    yield Promise.all(updatedCoupons);
    const paymentRecord = yield prismaClient_1.default.payment.create({
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
});
exports.createPaymentIntent = createPaymentIntent;
exports.subscriptionServices = {
    // createCheckoutSession,
    // createCustomer,
    // handleWebhook,
    createPaymentIntent: exports.createPaymentIntent,
};
