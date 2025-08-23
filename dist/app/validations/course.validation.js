"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createCourseZodSchema = void 0;
// validations/course.validation.ts
const zod_1 = require("zod");
exports.createCourseZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string(),
        description: zod_1.z.string(),
        thumbnail: zod_1.z.string().optional().nullable(),
        overviewVideo: zod_1.z.string().optional().nullable(),
        price: zod_1.z.number().positive(),
        isFree: zod_1.z.boolean(),
        authorId: zod_1.z.string(),
        categoryId: zod_1.z.string(),
        features: zod_1.z.array(zod_1.z.string()).optional().default([]),
        overviews: zod_1.z.array(zod_1.z.string()).optional().default([]),
        stack: zod_1.z.array(zod_1.z.string()).optional().default([]),
    }),
});
