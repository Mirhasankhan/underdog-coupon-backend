import { Restaurant } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";

const createRestaurantIntoDB = async (payload: Restaurant) => {
  const restaurant = await prisma.restaurant.create({
    data: {
      ...payload,
    },
  });

  return {
    restaurant,
  };
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
