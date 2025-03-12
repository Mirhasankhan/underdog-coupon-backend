import { Request, Response } from "express";
import catchAsync from "../../../shared/catchAsync";
import sendResponse from "../../../shared/sendResponse";
import { userService } from "./user.service";

const createUser = catchAsync(async (req: Request, res: Response) => {
  const result = await userService.createUserIntoDB(req.body);

  sendResponse(res, {
    success: true,
    statusCode: 201,
    message: "User created successfully",
    data: result,
  });
});

//get users
const getUsers = catchAsync(async (req: Request, res: Response) => {
  const users = await userService.getUsersFromDB();
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Users retrived successfully",
    data: users,
  });
});

//get single user
const getSingleUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.getSingleUserIntoDB(req.params.id);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "user retrived successfully",
    data: user,
  });
});
//update user
const updateUser = catchAsync(async (req: Request, res: Response) => {
  const user = await userService.updateUserIntoDB(req.user.id, req.body);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "User updated successfully",
    data: user,
  });
});


//get users
const getNotifications = catchAsync(async (req: Request, res: Response) => {
  const userId = req.user.id
  const notifications = await userService.getNotificationsFromDB(userId);
  sendResponse(res, {
    success: true,
    statusCode: 200,
    message: "Notifications retrived successfully",
    data: notifications,
  });
});

export const UserControllers = {
  createUser,
  getUsers,
  getSingleUser,
  updateUser,
  getNotifications
};
