import { Restaurant } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { uploadInSpace } from "../../../shared/UploadHelper";
import { Request } from "express";

// const createRestaurantIntoDB = async (payload: Restaurant) => {
//   const restaurant = await prisma.restaurant.create({
//     data: {
//       ...payload,
//     },
//   });

//   return {
//     restaurant,
//   };
// };

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

  // Upload files if provided
  const [imageUrl, videoUrl] = await Promise.all([
    processImages(files?.imageUrl, "imageUrl"),
    processImages(files?.videoUrl, "videoUrl"),
  ]);
  console.log(imageUrl, videoUrl);

  // Create restaurant entry in the database
  const restaurant = await prisma.restaurant.create({
    data: {
      ...payload,
      imageUrl: imageUrl?.[0],
      videoUrl: videoUrl?.[0],
    },
  });

  return { restaurant };
};

const getRestaurantsFromDB = async () => {
  const restaurants = await prisma.restaurant.findMany({
    include: {
      reviews: true,
    },
  });
  if (restaurants.length === 0) {
    throw new ApiError(404, "Coupons not found!");
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

  const updatedRestaurant = await prisma.restaurant.update({
    where: { id },
    data: restaurantData,
  });

  return updatedRestaurant;
};

export const restaurantService = {
  createRestaurantIntoDB,
  getRestaurantsFromDB,
  deleteRestaurnatFromDB,
  updateRestaurantFromDB,
};
