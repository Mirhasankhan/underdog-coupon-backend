"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const user_routes_1 = require("../modules/user/user.routes");
const auth_routes_1 = require("../modules/auth/auth.routes");
const review_routes_1 = require("../modules/review/review.routes");
const subscription_routes_1 = require("../modules/subscriptions/subscription.routes");
const coupon_routes_1 = require("../modules/coupon/coupon.routes");
const restaurant_routes_1 = require("../modules/restaurant/restaurant.routes");
const router = express_1.default.Router();
const moduleRoutes = [
    {
        path: "/users",
        route: user_routes_1.userRoutes,
    },
    {
        path: "/auth",
        route: auth_routes_1.authRoute,
    },
    {
        path: "/review",
        route: review_routes_1.reviewRoutes,
    },
    {
        path: "/payment",
        route: subscription_routes_1.subscriptionRoute,
    },
    {
        path: "/coupon",
        route: coupon_routes_1.couponRoutes,
    },
    {
        path: "/restaurant",
        route: restaurant_routes_1.restaurantRoutes,
    },
];
moduleRoutes.forEach((route) => router.use(route.path, route.route));
exports.default = router;
