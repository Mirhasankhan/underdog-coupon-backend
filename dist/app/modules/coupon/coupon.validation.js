"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponValidation = void 0;
const zod_1 = require("zod");
const isoDateTimeRegex = /^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}.\d{3}Z$/;
const couponValidationSchema = zod_1.z.object({
    id: zod_1.z.string().length(24, "ID must be 24 characters long").optional(),
    plan: zod_1.z.enum(["BASIC", "PREMIUM"], { message: "Invalid plan" }),
    couponName: zod_1.z.string().min(1, "Coupon name cannot be empty"),
    code: zod_1.z
        .string()
        .min(10, "Coupon code should be 10 characters")
        .max(10, "Coupon code should not exceed 10 characters")
        .regex(/^[A-Z0-9]+$/, "Coupon code must be alphanumeric and uppercase").optional(),
    activeFrom: zod_1.z
        .string()
        .refine((val) => isoDateTimeRegex.test(val), {
        message: "activeFrom must be in ISO 8601 DateTime format (YYYY-MM-DDTHH:mm:ss.sssZ)",
    })
        .transform((val) => new Date(val))
        .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid date format for activeFrom",
    }),
    activeTo: zod_1.z
        .string()
        .refine((val) => isoDateTimeRegex.test(val), {
        message: "activeTo must be in ISO 8601 DateTime format (YYYY-MM-DDTHH:mm:ss.sssZ)",
    })
        .transform((val) => new Date(val))
        .refine((date) => date instanceof Date && !isNaN(date.getTime()), {
        message: "Invalid date format for activeTo",
    })
        .refine((date) => date > new Date(), {
        message: "activeTo must be a future date",
    }),
    limitNumber: zod_1.z
        .number()
        .int()
        .positive("Limit number must be a positive integer"),
});
exports.couponValidation = {
    couponValidationSchema,
};
