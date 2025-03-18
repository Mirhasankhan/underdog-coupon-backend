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
exports.reviewService = void 0;
const prismaClient_1 = __importDefault(require("../../../prisma/prismaClient"));
const ApiErrors_1 = __importDefault(require("../../../errors/ApiErrors"));
const date_fns_1 = require("date-fns");
const createReviewIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const review = yield prismaClient_1.default.review.create({
        data: Object.assign({}, payload),
    });
    return { review };
});
const getAllReviews = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const filter = id ? { restaurantId: id } : {};
    const reviews = yield prismaClient_1.default.review.findMany({
        where: filter,
    });
    if (reviews.length === 0) {
        throw new ApiErrors_1.default(404, "Reviews not found!");
    }
    const ratingCounts = [1, 2, 3, 4, 5].reduce((acc, rating) => {
        acc[rating] = reviews.filter((review) => review.rating === rating).length;
        return acc;
    }, {});
    const totalReviews = reviews.length;
    const ratingPercentages = [1, 2, 3, 4, 5].map((rating) => ({
        rating,
        percentage: ((ratingCounts[rating] / totalReviews) * 100).toFixed(2),
    }));
    const monthWiseReviews = reviews.reduce((acc, review) => {
        const monthKey = (0, date_fns_1.format)(new Date(review.createdAt), "MMMM");
        if (!acc[monthKey]) {
            acc[monthKey] = { count: 0, ratings: [] };
        }
        acc[monthKey].count += 1;
        acc[monthKey].ratings.push(review.rating);
        return acc;
    }, {});
    return {
        reviews,
        ratingPercentages,
        monthWiseReviews,
    };
});
exports.default = getAllReviews;
exports.reviewService = {
    createReviewIntoDB,
    getAllReviews,
};
