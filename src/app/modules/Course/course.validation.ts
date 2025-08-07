
// validations/course.validation.ts
import { z } from "zod";

export const createCourseZodSchema = z.object({
  body: z.object({
    title: z
      .string("Title is required"),
    description: z
      .string("Description is required"),


    thumbnail: z.string().url("Invalid video URL").optional().nullable(),

    price: z
      .number("Price must be a number")
      .min(0, "Price can't be negative"),

    isFree: z.boolean().default(false),

    authorId: z.string("Author ID is required"),

    categoryId: z.string("Category ID is required"),

    couponId: z.string().optional().nullable(),
  }),
});