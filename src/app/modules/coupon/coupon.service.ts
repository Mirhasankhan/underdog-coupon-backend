import { Coupon } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import prisma from "../../../prisma/prismaClient";

const createCouponIntoDB = async (payload: Coupon) => {
  const existingCoupon = await prisma.coupon.findFirst({
    where: { code: payload.code },
  });
  if (existingCoupon) {
    throw new ApiError(409, "A coupon with this code already exists.");
  }

  if (new Date(payload.activeFrom) > new Date(payload.activeTo)) {
    throw new ApiError(400, "The 'activeFrom' date cannot be later than the 'activeTo' date.");
  }

  const coupon = await prisma.coupon.create({
    data: {
      ...payload,
    },
  });

  return {
    coupon
  };
};

const getCouponFromDB = async () => {
  const coupons = await prisma.coupon.findMany();

  if (coupons.length === 0) {
    throw new ApiError(404, "Coupons not found!");
  }

  return coupons;
};

const deleteCouponFromDB = async (couponId: string) => {
  const existingCoupon = await prisma.coupon.findFirst({
    where: { id: couponId },
  });

  if (!existingCoupon) {
    throw new ApiError(401, "Coupon Not Found");
  }

  if (existingCoupon.used > 0) {
    throw new ApiError(400, "Coupon already in use and cannot be deleted");
  }

  const result = await prisma.coupon.delete({ where: { id: couponId } });
  return result;
};

export const couponService = {
  createCouponIntoDB,
  getCouponFromDB,
  deleteCouponFromDB,
};
