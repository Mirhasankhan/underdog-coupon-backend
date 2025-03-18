import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import { restaurantService } from "./restaurant.service";
import sendResponse from "../../../shared/sendResponse";

const createRestaurant = catchAsync(async (req, res) => {
  const result = await restaurantService.createRestaurantIntoDB(req);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Restaurant created successfully",
    data: result,
  });
});
const getRestaurants = catchAsync(async (req: Request, res: Response) => {
  const email = req.query.email;
  const page = req.query.page;
  const result = await restaurantService.getRestaurantsFromDB(
    Number(page),
    email as string
  );

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "Restaurant Retrieved successfully",
    data: result,
  });
});

const deleteRestarant = catchAsync(async (req: Request, res: Response) => {
  const restaurantId = req.params.id;

  await restaurantService.deleteRestaurnatFromDB(restaurantId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Restaurant deleted successfully",
  });
});
const updateRestaurant = catchAsync(async (req: Request, res: Response) => {
  const result = await restaurantService.updateRestaurantFromDB(
    req.params.id,
    req
  );
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Restaurant Updated successfully",
    data: result,
  });
});

export const restaurantController = {
  createRestaurant,
  getRestaurants,
  deleteRestarant,
  updateRestaurant,
};
