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
const createRestaurantIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurant = yield prismaClient_1.default.restaurant.create({
        data: Object.assign({}, payload),
    });
    return {
        restaurant,
    };
});
const getRestaurantsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    const restaurants = yield prismaClient_1.default.restaurant.findMany({
        include: {
            reviews: true,
        },
    });
    if (restaurants.length === 0) {
        throw new ApiErrors_1.default(404, "Coupons not found!");
    }
    return restaurants;
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
    const updatedRestaurant = yield prismaClient_1.default.restaurant.update({
        where: { id },
        data: restaurantData,
    });
    return updatedRestaurant;
});
exports.restaurantService = {
    createRestaurantIntoDB,
    getRestaurantsFromDB,
    deleteRestaurnatFromDB,
    updateRestaurantFromDB,
};
