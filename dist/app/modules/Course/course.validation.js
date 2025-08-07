"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseZodSchema = void 0;
// validations/course.validation.ts
const zod_1 = require("zod");
exports.createCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z
            .string("Title is required"),
        description: zod_1.z
            .string("Description is required"),
        thumbnail: zod_1.z.string().url("Invalid video URL").optional().nullable(),
        price: zod_1.z
            .number("Price must be a number")
            .min(0, "Price can't be negative"),
        isFree: zod_1.z.boolean().default(false),
        authorId: zod_1.z.string("Author ID is required"),
        categoryId: zod_1.z.string("Category ID is required"),
        couponId: zod_1.z.string().optional().nullable(),
    }),
});
