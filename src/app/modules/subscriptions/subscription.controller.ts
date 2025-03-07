import { Request, Response } from "express";
import { subscriptionServices } from "./subscription.service";
import sendResponse from "../../../shared/sendResponse";

export const handleCreatePaymentIntent = async (
  req: Request,
  res: Response
) => {
  const { planType } = req.body;
  const userId = req.user.id
  const paymentData = await subscriptionServices.createPaymentIntent(
    userId,
    planType
  );

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Subscription Successfull",
    data: paymentData,
  });
};

export const subscriptionController = {
  handleCreatePaymentIntent,
};
