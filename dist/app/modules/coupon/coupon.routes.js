"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponRoutes = void 0;
const express_1 = __importDefault(require("express"));
const coupon_controller_1 = require("./coupon.controller");
const validateRequest_1 = __importDefault(require("../../middlewares/validateRequest"));
const coupon_validation_1 = require("./coupon.validation");
const auth_1 = __importDefault(require("../../middlewares/auth"));
const client_1 = require("@prisma/client");
const router = express_1.default.Router();
router.post("/create", (0, auth_1.default)(client_1.UserRole.ADMIN), (0, validateRequest_1.default)(coupon_validation_1.couponValidation.couponValidationSchema), coupon_controller_1.couponController.createCoupon);
router.get("/", coupon_controller_1.couponController.getCoupons);
router.delete("/delete/:id", (0, auth_1.default)(client_1.UserRole.ADMIN), coupon_controller_1.couponController.deleteCoupon);
exports.couponRoutes = router;
