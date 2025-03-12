import { z } from "zod";

const restaurantValidationSchema = z.object({
  imageUrl: z.string().url("Invalid image URL"),
  videoUrl: z.string().url("Invalid video URL"),
  restaurantName: z.string().min(1, "Restaurant name cannot be empty"),
  contact: z
    .string()
    .min(10, "Contact must be at least 10 characters long"),
  location: z.string().min(1, "Location cannot be empty"),
});


const updateRestaurantValidationSchema = z.object({
  imageUrl: z.string().url("Invalid image URL").optional(),
  videoUrl: z.string().url("Invalid video URL").optional(),
  restaurantName: z.string().min(1, "Restaurant name cannot be empty").optional(),
  contact: z
    .string()
    .min(10, "Contact must be at least 10 characters long")
    .optional(),
  location: z.string().min(1, "Location cannot be empty").optional(),
});




export const restaurantValidation = {
    restaurantValidationSchema,
    updateRestaurantValidationSchema,
    
}
