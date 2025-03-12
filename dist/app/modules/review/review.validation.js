"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.bookingValidation = void 0;
const zod_1 = require("zod");
const reviewValidationSchema = zod_1.z.object({
    campsiteId: zod_1.z.string().min(1, "Campsite ID is required"),
    rating: zod_1.z
        .number()
        .int()
        .min(1, "Rating must be at least 1")
        .max(5, "Rating must be at most 5"),
    comment: zod_1.z.string().optional(),
});
exports.bookingValidation = {
    reviewValidationSchema,
};
