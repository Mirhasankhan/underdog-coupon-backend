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
exports.restaurantController = void 0;
const catchAsync_1 = __importDefault(require("../../../shared/catchAsync"));
const restaurant_service_1 = require("./restaurant.service");
const sendResponse_1 = __importDefault(require("../../../shared/sendResponse"));
const createRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantService.createRestaurantIntoDB(req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Restaurant created successfully",
        data: result,
    });
}));
const getRestaurants = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.query.email;
    const page = req.query.page;
    const result = yield restaurant_service_1.restaurantService.getRestaurantsFromDB(Number(page), email);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 201,
        message: "Restaurant Retrieved successfully",
        data: result,
    });
}));
const deleteRestarant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const restaurantId = req.params.id;
    yield restaurant_service_1.restaurantService.deleteRestaurnatFromDB(restaurantId);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Restaurant deleted successfully",
    });
}));
const updateRestaurant = (0, catchAsync_1.default)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield restaurant_service_1.restaurantService.updateRestaurantFromDB(req.params.id, req);
    (0, sendResponse_1.default)(res, {
        success: true,
        statusCode: 200,
        message: "Restaurant Updated successfully",
        data: result,
    });
}));
exports.restaurantController = {
    createRestaurant,
    getRestaurants,
    deleteRestarant,
    updateRestaurant,
};
