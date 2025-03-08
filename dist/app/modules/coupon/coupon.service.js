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
exports.couponService = void 0;
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const createCouponIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCoupon = yield prismaClient_1.default.coupon.findFirst({
        where: { code: payload.code },
    });
    if (existingCoupon) {
        throw new ApiErrors_1.default(409, "A coupon with this code already exists.");
    }
    if (new Date(payload.activeFrom) > new Date(payload.activeTo)) {
        throw new ApiErrors_1.default(400, "The 'activeFrom' date cannot be later than the 'activeTo' date.");
    }
    const coupon = yield prismaClient_1.default.coupon.create({
        data: Object.assign({}, payload),
    });
    return {
        coupon
    };
});
const getCouponFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const coupons = yield prismaClient_1.default.coupon.findMany();
    if (coupons.length === 0) {
        throw new ApiErrors_1.default(404, "Coupons not found!");
    }
    return coupons;
});
const deleteCouponFromDB = (couponId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingCoupon = yield prismaClient_1.default.coupon.findFirst({
        where: { id: couponId },
    });
    if (!existingCoupon) {
        throw new ApiErrors_1.default(401, "Coupon Not Found");
    }
    if (existingCoupon.used > 0) {
        throw new ApiErrors_1.default(400, "Coupon already in use and cannot be deleted");
    }
    const result = yield prismaClient_1.default.coupon.delete({ where: { id: couponId } });
    return result;
});
exports.couponService = {
    createCouponIntoDB,
    getCouponFromDB,
    deleteCouponFromDB,
};
