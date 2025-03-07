import { Request, Response } from "express";
import { couponService } from "./coupon.service";
import sendResponse from "../../../shared/sendResponse";
import catchAsync from "../../../shared/catchAsync";

const createCoupon = catchAsync(async (req: Request, res: Response) => {
  const result = await couponService.createCouponIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Coupon created successfully",
    data: result,
  });
});

const getCoupons = catchAsync(async (req: Request, res: Response) => {
  const coupons = await couponService.getCouponFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupons retrived successfully",
    data: coupons,
  });
});

//delete user
const deleteCoupon = catchAsync(async (req: any, res: Response) => {
  const couponId = req.params.id;

  await couponService.deleteCouponFromDB(couponId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Coupon deleted successfully",
  });
});

export const couponController = {
  createCoupon,
  getCoupons,
  deleteCoupon
};
