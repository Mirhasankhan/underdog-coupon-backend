"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.restaurantValidation = void 0;
const zod_1 = require("zod");
const restaurantValidationSchema = zod_1.z.object({
    imageUrl: zod_1.z.string().url("Invalid image URL"),
    videoUrl: zod_1.z.string().url("Invalid video URL").optional(),
    restaurantName: zod_1.z.string().min(1, "Restaurant name cannot be empty"),
    contact: zod_1.z.string().min(10, "Contact must be at least 10 characters long"),
    location: zod_1.z.string().min(1, "Location cannot be empty"),
});
const updateRestaurantValidationSchema = zod_1.z.object({
    imageUrl: zod_1.z.string().url("Invalid image URL").optional(),
    videoUrl: zod_1.z.string().url("Invalid video URL").optional(),
    restaurantName: zod_1.z
        .string()
        .min(1, "Restaurant name cannot be empty")
        .optional(),
    contact: zod_1.z
        .string()
        .min(10, "Contact must be at least 10 characters long")
        .optional(),
    location: zod_1.z.string().min(1, "Location cannot be empty").optional(),
});
exports.restaurantValidation = {
    restaurantValidationSchema,
    updateRestaurantValidationSchema,
};
