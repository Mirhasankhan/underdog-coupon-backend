import { Restaurant } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { uploadInSpace } from "../../../shared/UploadHelper";
import { Request } from "express";
import bcrypt from "bcryptjs";

const createRestaurantIntoDB = async (req: Request) => {
  const payload = req.body;
  const files = req.files as { [fieldname: string]: Express.Multer.File[] };

  const processImages = async (
    files: Express.Multer.File[],
    folder: string
  ) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, `courses/class/${folder}`))
    );
  };

  const [imageUrl, videoUrl] = await Promise.all([
    processImages(files?.imageUrl, "imageUrl"),
    processImages(files?.videoUrl, "videoUrl"),
  ]);

  const email = `${req.body.restaurantName
    .replace(/\s+/g, "")
    .toLowerCase()}${Math.floor(100 + Math.random() * 900)}@gmail.com`;

  const defaultPassword = "12345Aa@";
  const hashedPassword = await bcrypt.hash(defaultPassword, 10);

  const result = await prisma.$transaction(async (prisma) => {
    const newSeller = await prisma.user.create({
      data: {
        userName: req.body.restaurantName,
        email,
        password: hashedPassword,
        role: "SELLER",
        phone: req.body.contact,
      },
    });

    const newRestaurant = await prisma.restaurant.create({
      data: {
        ...payload,
        imageUrl: imageUrl?.[0],
        videoUrl: videoUrl?.[0],
        ownerId: newSeller.id,
      },
    });

    return { restaurant: newRestaurant, seller: newSeller };
  });

  return result;
};

const getRestaurantsFromDB = async (page?: number, email?: string) => {
  const pageSize = 5;
  const pageNumber = page ? Number(page) : 1;
  const skip = (pageNumber - 1) * pageSize;

  const filter = email ? { owner: { email: email } } : {};

  const restaurants = await prisma.restaurant.findMany({
    where: filter,
    take: page ? pageSize : undefined,
    skip: page ? skip : undefined,
    include: {
      reviews: true,
      owner: {
        select: {
          id: true,
          email: true,
          userName: true,
        },
      },
    },
  });

  if (restaurants.length === 0) {
    throw new ApiError(404, "Restaurants not found!");
  }

  return restaurants;
};

const deleteRestaurnatFromDB = async (restaurantId: string) => {
  const existingRestarurant = await prisma.restaurant.findFirst({
    where: { id: restaurantId },
  });

  if (!existingRestarurant) {
    throw new ApiError(401, "Restaurant Not Found");
  }

  const result = await prisma.restaurant.delete({
    where: { id: restaurantId },
  });
  return result;
};

const updateRestaurantFromDB = async (id: string, restaurantData: any) => {
  const existingRestaurant = await prisma.restaurant.findUnique({
    where: { id },
  });

  if (!existingRestaurant) {
    throw new Error("Restaurant not found");
  }

  const files = restaurantData.files as {
    [fieldname: string]: Express.Multer.File[];
  };

  const processImages = async (
    files: Express.Multer.File[],
    folder: string
  ) => {
    if (!files || files.length === 0) return null;
    return Promise.all(
      files.map((file) => uploadInSpace(file, `courses/class/${folder}`))
    );
  };

  const [imageUrl, videoUrl] = await Promise.all([
    processImages(files?.imageUrl, "imageUrl"),
    processImages(files?.videoUrl, "videoUrl"),
  ]);

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: {
      imageUrl: imageUrl?.[0],
      videoUrl: videoUrl?.[0],
      ...restaurantData.body,
    },
  });

  return updatedRestaurant;
};

export const restaurantService = {
  createRestaurantIntoDB,
  getRestaurantsFromDB,
  deleteRestaurnatFromDB,
  updateRestaurantFromDB,
};
