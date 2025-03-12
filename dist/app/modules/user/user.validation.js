"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.userValidation = void 0;
const zod_1 = require("zod");
const userRegisterValidationSchema = zod_1.z.object({
    userName: zod_1.z.string().min(2, "User name must be at least 2 characters long"),
    email: zod_1.z.string().email("Invalid email address"),
    phone: zod_1.z.string().min(10, "Mobile number at least 10 digit long").optional(),
    avatar: zod_1.z.string().optional(),
    password: zod_1.z
        .string()
        .min(8, "Password must be at least 8 characters long")
        .regex(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/, "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"),
});
const userUpdateValidationSchema = zod_1.z.object({
    userName: zod_1.z
        .string()
        .min(2, "user name must be at least 2 characters long")
        .optional(),
    phone: zod_1.z.string().min(10, "Mobile Number at least 10 Digit long").optional(),
    role: zod_1.z.enum(["ADMIN", "USER"]).optional(),
    status: zod_1.z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
});
exports.userValidation = {
    userRegisterValidationSchema,
    userUpdateValidationSchema,
};
