import { User, UserRole } from "@prisma/client";
import ApiError from "../../../errors/ApiErrors";
import { jwtHelpers } from "../../../helpers/jwtHelpers";
import config from "../../../config";
import prisma from "../../../prisma/prismaClient";
import bcrypt from "bcryptjs";

const createUserIntoDB = async (payload: User) => {
  const existingUser = await prisma.user.findFirst({
    where: { email: payload.email },
  });
  if (existingUser) {
    throw new ApiError(409, "Email already exist!");
  }

  const hashedPassword = await bcrypt.hash(payload.password as string, 10);

  const user = await prisma.user.create({
    data: {
      ...payload,
      password: hashedPassword,
    },
  });

  const accessToken = jwtHelpers.generateToken(
    user,
    config.jwt.jwt_secret as string,
    config.jwt.expires_in as string
  );

  const { password, ...sanitizedUser } = user;

  return {
    accessToken,
    user: sanitizedUser,
  };
};

//get single user
const getSingleUserIntoDB = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new ApiError(404, "User not found!");
  }

  const { password, ...sanitizedUser } = user;
  return sanitizedUser;
};

const getUsersFromDB = async () => {
  const users = await prisma.user.findMany();

  if (users.length === 0) {
    throw new ApiError(404, "Users not found!");
  }

  const sanitizedUsers = users.map(
    ({ password, ...sanitizedUser }) => sanitizedUser
  );

  return sanitizedUsers;
};

// const updateUserIntoDB = async (id: string, userData: any) => {
//   const existingUser = await prisma.user.findUnique({ where: { id: id } });
//   if (!existingUser) {
//     throw new ApiError(404, "No User Found to update");
//   } 
//   const updatedUser = await prisma.user.update({
//     where: { id },
//     data: userData,
//   });

//   const { password, ...sanitizedUser } = updatedUser;

//   return sanitizedUser;
// };


const updateUserIntoDB = async (id: string, userData: any) => {
  const existingUser = await prisma.user.findUnique({ where: { id } });

  if (!existingUser) {
    throw new ApiError(404, "No User Found to update");
  }

  const [updatedUser, notification] = await prisma.$transaction([
    prisma.user.update({
      where: { id },
      data: userData,
    }),
    prisma.notification.create({
      data: {
        userId: id,
        message: "Your profile has been updated successfully.",       
      },
    }),
  ]);

  const { password, ...sanitizedUser } = updatedUser;
  return sanitizedUser;
};

const getNotificationsFromDB = async (userId:string) => {
  const notifications = await prisma.notification.findMany({where:{userId:userId}});
  if (notifications.length === 0) {
    throw new ApiError(404, "No Notifications found!");
  }
  return notifications;
};


export const userService = {
  createUserIntoDB,
  getSingleUserIntoDB,
  getUsersFromDB,
  updateUserIntoDB,
  getNotificationsFromDB
};
