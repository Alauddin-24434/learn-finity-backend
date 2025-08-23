"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.createLessonZodSchema = void 0;
const zod_1 = require("zod");
exports.createLessonZodSchema = zod_1.z.object({
    body: zod_1.z.object({
        title: zod_1.z.string("Title is required"),
        duration: zod_1.z.string("Duration is required"),
        videoUrl: zod_1.z.string("Video URL is required").optional(),
        publicId: zod_1.z.string("Public id").optional(),
        courseId: zod_1.z.string("Course ID is required"),
    }),
});
