// validations/course.validation.ts
import { z } from "zod";

export const createCourseZodSchema = z.object({
  body: z.object({
    title: z
      .string("Title is required")
      .min(1, "Title is required"),

    description: z
      .string("Description is required")
      .min(1, "Description is required"),

    thumbnail: z
      .string()
      .url("Invalid photo URL")
      .optional()
      .nullable(),

  

    overviewVideo: z
      .string()
      .url("Invalid video URL")
      .optional()
      .nullable(),

    price: z
      .number("Price is required")
      .min(0, "Price can't be negative"),

    isFree: z.boolean().default(false),

    authorId: z
      .string("Author ID is required")
      .min(1, "Author ID is required"),

    categoryId: z
      .string("Category ID is required")
      .min(1, "Category ID is required"),

    features: z
      .array(z.string().min(1, "Feature can't be empty"))
      .optional()
      .default([]),

    overviews: z
      .array(z.string().min(1, "Overview item can't be empty"))
      .optional()
      .default([]),

    stack: z
      .array(z.string().min(1, "Stack item can't be empty"))
      .optional()
      .default([]),
  }),
});
