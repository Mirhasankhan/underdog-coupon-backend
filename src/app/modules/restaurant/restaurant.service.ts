import { Restaurant } from "@prisma/client";
import prisma from "../../../prisma/prismaClient";
import ApiError from "../../../errors/ApiErrors";
import { uploadInSpace } from "../../../shared/UploadHelper";
import { Request } from "express";
import bcrypt from "bcryptjs";
import admin from "../../../helpers/firebaseAdmin";

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

  const updatedRestaurants = restaurants.map((restaurant) => {
    const totalReviews = restaurant.reviews.length;
    const averageRating =
      totalReviews > 0
        ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) /
          totalReviews
        : null;

    return {
      ...restaurant,
      averageRating,
    };
  });

  return updatedRestaurants;
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

// const sendSingleNotification = async (req: any) => {
//   const { latitude, longitude, userId} = req.body;

//   if (!latitude || !longitude) {
//     throw new ApiError(400, "Latitude and Longitude are required");
//   }
//   const user = await prisma.user.findUnique({
//     where: { id: userId },
//   });

//   if (!user?.fcmToken) {
//     throw new ApiError(404, "User not found with FCM token");
//   }
 
//   const nearbyRestaurantsRaw = await prisma.restaurant.findRaw({
//     filter: {
//       locationData: {
//         $geoWithin: {
//           $centerSphere: [[longitude, latitude], 1 / 6378.1],
//         },
//       },
//     },
//   }) 

//   const nearbyRestaurants = (nearbyRestaurantsRaw as unknown) as any[];

//   if (!nearbyRestaurants.length) {
//     throw new ApiError(404, "No nearby restaurants found");
//   }

//   const formattedRestaurants = nearbyRestaurants?.map((r: any) => ({
//     name: r.restaurantName,
//     address: r.location,
//     latitude: r.locationData.coordinates[1],
//     longitude: r.locationData.coordinates[0],
//   }));

//   const messageBody = formattedRestaurants
//     .map(
//       (r: {
//         name: string;
//         address: string;
//         latitude: string;
//         longitude: string;
//       }) => `${r.name} - ${r.address} (Lat: ${r.latitude}, Lng: ${r.longitude})`
//     )
//     .join("\n");

//   const message = {
//     notification: {
//       title: "Restaurants Near You!",
//       body: messageBody,
//     },
//     token: user.fcmToken,
//   };

//   try {
//     const response = await admin.messaging().send(message);
//     return response;
//   } catch (error: any) {
//     if (error.code === "messaging/invalid-registration-token") {
//       throw new ApiError(400, "Invalid FCM registration token");
//     } else if (error.code === "messaging/registration-token-not-registered") {
//       throw new ApiError(404, "FCM token is no longer registered");
//     } else {
//       throw new ApiError(500, "Failed to send notification");
//     }
//   }
// };

export const restaurantService = {
  createRestaurantIntoDB,
  getRestaurantsFromDB,
  deleteRestaurnatFromDB,
  updateRestaurantFromDB,
  // sendSingleNotification
};
