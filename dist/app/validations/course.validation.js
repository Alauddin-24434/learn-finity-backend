"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseZodSchema = void 0;
// validations/course.validation.ts
const zod_1 = require("zod");
exports.createCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string("Title is required")
            .min(1, "Title is required"),
        description: zod_1.z
            .string("Description is required")
            .min(1, "Description is required"),
        thumbnail: zod_1.z
            .string()
            .url("Invalid photo URL")
            .optional()
            .nullable(),
        overviewVideo: zod_1.z
            .string().optional()
            .nullable(),
        price: zod_1.z
            .string("Price is required"),
        isFree: zod_1.z.string("Is free is required"),
        authorId: zod_1.z
            .string("Author ID is required")
            .min(1, "Author ID is required"),
        categoryId: zod_1.z
            .string("Category ID is required")
            .min(1, "Category ID is required"),
        features: zod_1.z
            .array(zod_1.z.string().min(1, "Feature can't be empty"))
            .optional()
            .default([]),
        overviews: zod_1.z
            .array(zod_1.z.string().min(1, "Overview item can't be empty"))
            .optional()
            .default([]),
        stack: zod_1.z
            .array(zod_1.z.string().min(1, "Stack item can't be empty"))
            .optional()
            .default([]),
    }),
});
