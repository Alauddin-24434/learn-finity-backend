// validations/course.validation.ts
import { z } from "zod";

export const createCourseZodSchema = z.object({
  body: z.object({
    title: z.string(),

    description: z.string(),

    thumbnail: z.string().optional().nullable(),

    overviewVideo: z.string().optional().nullable(),

    price: z.number().positive(),

    isFree: z.boolean(),

    authorId: z.string(),

    categoryId: z.string(),

    features: z.array(z.string()).optional().default([]),

    overviews: z.array(z.string()).optional().default([]),

    stack: z.array(z.string()).optional().default([]),
  }),
});
