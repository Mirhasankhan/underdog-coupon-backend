import express from "express";
import { userRoutes } from "../modules/user/user.routes";
import { authRoute } from "../modules/auth/auth.routes";
import { reviewRoutes } from "../modules/review/review.routes";
import { subscriptionRoute } from "../modules/subscriptions/subscription.routes";
import { couponRoutes } from "../modules/coupon/coupon.routes";
import { restaurantRoutes } from "../modules/restaurant/restaurant.routes";

const router = express.Router();

const moduleRoutes = [
  {
    path: "/users",
    route: userRoutes,
  },
  {
    path: "/auth",
    route: authRoute,
  },
  {
    path: "/review",
    route: reviewRoutes,
  },
  {
    path: "/payment",
    route: subscriptionRoute,
  },
  {
    path: "/coupon",
    route: couponRoutes,
  },
  {
    path: "/restaurant",
    route: restaurantRoutes,
  },
];

moduleRoutes.forEach((route) => router.use(route.path, route.route));

export default router;
