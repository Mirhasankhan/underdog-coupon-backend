import { z } from "zod";

const userRegisterValidationSchema = z.object({
  userName: z.string().min(2, "User name must be at least 2 characters long"), 
  email: z.string().email("Invalid email address"),
  phone: z.string().min(10, "Mobile number at least 10 digit long").optional(),
  avatar: z.string().optional(),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters long")
    .regex(
      /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
      "Password must include at least one uppercase letter, one lowercase letter, one number, and one special character"
    ),
});

const userUpdateValidationSchema = z.object({
  userName: z
    .string()
    .min(2, "user name must be at least 2 characters long")
    .optional(),
 
  phone: z.string().min(10, "Mobile Number at least 10 Digit long").optional(),
  role: z.enum(["ADMIN", "USER"]).optional(),
  status: z.enum(["ACTIVE", "BLOCKED", "DELETED"]).optional(),
});

export const userValidation = {
  userRegisterValidationSchema,
  userUpdateValidationSchema,
};

