"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantService = void 0;
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const UploadHelper_1 = require("../../../shared/UploadHelper");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const createRestaurantIntoDB = (req) => __awaiter(void 0, void 0, void 0, function* () {
    const payload = req.body;
    const files = req.files;
    const processImages = (files, folder) => __awaiter(void 0, void 0, void 0, function* () {
        if (!files || files.length === 0)
            return null;
        return Promise.all(files.map((file) => (0, UploadHelper_1.uploadInSpace)(file, `courses/class/${folder}`)));
    });
    const [imageUrl, videoUrl] = yield Promise.all([
        processImages(files === null || files === void 0 ? void 0 : files.imageUrl, "imageUrl"),
        processImages(files === null || files === void 0 ? void 0 : files.videoUrl, "videoUrl"),
    ]);
    const email = `${req.body.restaurantName
        .replace(/\s+/g, "")
        .toLowerCase()}${Math.floor(100 + Math.random() * 900)}@gmail.com`;
    const defaultPassword = "12345Aa@";
    const hashedPassword = yield bcryptjs_1.default.hash(defaultPassword, 10);
    const result = yield prismaClient_1.default.$transaction((prisma) => __awaiter(void 0, void 0, void 0, function* () {
        const newSeller = yield prisma.user.create({
            data: {
                userName: req.body.restaurantName,
                email,
                password: hashedPassword,
                role: "SELLER",
                phone: req.body.contact,
            },
        });
        const newRestaurant = yield prisma.restaurant.create({
            data: Object.assign(Object.assign({}, payload), { imageUrl: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl[0], videoUrl: videoUrl === null || videoUrl === void 0 ? void 0 : videoUrl[0], ownerId: newSeller.id }),
        });
        return { restaurant: newRestaurant, seller: newSeller };
    }));
    return result;
});
const getRestaurantsFromDB = (page, email) => __awaiter(void 0, void 0, void 0, function* () {
    const pageSize = 5;
    const pageNumber = page ? Number(page) : 1;
    const skip = (pageNumber - 1) * pageSize;
    const filter = email ? { owner: { email: email } } : {};
    const restaurants = yield prismaClient_1.default.restaurant.findMany({
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
        throw new ApiErrors_1.default(404, "Restaurants not found!");
    }
    const updatedRestaurants = restaurants.map((restaurant) => {
        const totalReviews = restaurant.reviews.length;
        const averageRating = totalReviews > 0
            ? restaurant.reviews.reduce((sum, review) => sum + review.rating, 0) /
                totalReviews
            : null;
        return Object.assign(Object.assign({}, restaurant), { averageRating });
    });
    return updatedRestaurants;
});
const deleteRestaurnatFromDB = (restaurantId) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRestarurant = yield prismaClient_1.default.restaurant.findFirst({
        where: { id: restaurantId },
    });
    if (!existingRestarurant) {
        throw new ApiErrors_1.default(401, "Restaurant Not Found");
    }
    const result = yield prismaClient_1.default.restaurant.delete({
        where: { id: restaurantId },
    });
    return result;
});
const updateRestaurantFromDB = (id, restaurantData) => __awaiter(void 0, void 0, void 0, function* () {
    const existingRestaurant = yield prismaClient_1.default.restaurant.findUnique({
        where: { id },
    });
    if (!existingRestaurant) {
        throw new Error("Restaurant not found");
    }
    const files = restaurantData.files;
    const processImages = (files, folder) => __awaiter(void 0, void 0, void 0, function* () {
        if (!files || files.length === 0)
            return null;
        return Promise.all(files.map((file) => (0, UploadHelper_1.uploadInSpace)(file, `courses/class/${folder}`)));
    });
    const [imageUrl, videoUrl] = yield Promise.all([
        processImages(files === null || files === void 0 ? void 0 : files.imageUrl, "imageUrl"),
        processImages(files === null || files === void 0 ? void 0 : files.videoUrl, "videoUrl"),
    ]);
    const updatedRestaurant = yield prismaClient_1.default.restaurant.update({
        where: { id },
        data: Object.assign({ imageUrl: imageUrl === null || imageUrl === void 0 ? void 0 : imageUrl[0], videoUrl: videoUrl === null || videoUrl === void 0 ? void 0 : videoUrl[0] }, restaurantData.body),
    });
    return updatedRestaurant;
});
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
exports.restaurantService = {
    createRestaurantIntoDB,
    getRestaurantsFromDB,
    deleteRestaurnatFromDB,
    updateRestaurantFromDB,
    // sendSingleNotification
};
