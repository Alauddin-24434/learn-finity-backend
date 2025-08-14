"use strict";
// services/lesson.service.ts
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonService = void 0;
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../error/AppError");
/**
 ========================================================================================
 * Create a new lesson with rollback for uploaded video if DB fails
 ========================================================================================
 */
const createLessonIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let videoPublicId = payload.videoPublicId;
    try {
        // Create the lesson record in DB
        return yield prisma_1.prisma.lesson.create({
            data: {
                title: payload.title,
                duration: payload.duration,
                courseId: payload.courseId,
                video: payload.video,
                videoPublicId,
            },
        });
    }
    catch (error) {
        // If DB insert fails, delete uploaded video from Cloudinary
        if (videoPublicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
        }
        throw error;
    }
});
/**
 ========================================================================================
 * Get all lessons with related course info
 ========================================================================================
 */
const getAllLessonsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.lesson.findMany({
        include: { course: true },
    });
});
/**
 ========================================================================================
 * Get a single lesson by ID (with related course)
 ========================================================================================
 */
const getSingleLessonFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield prisma_1.prisma.lesson.findUnique({
        where: { id },
        include: { course: true },
    });
    if (!lesson)
        throw new AppError_1.AppError(404, "Lesson not found");
    return lesson;
});
/**
 ========================================================================================
 * Delete lesson by ID (hard delete)
 ========================================================================================
 */
const deleteLessonFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield prisma_1.prisma.lesson.findUnique({ where: { id } });
    if (!lesson)
        throw new AppError_1.AppError(404, "Lesson not found");
    return prisma_1.prisma.lesson.update({
        where: { id },
        data: {
            isDeleted: true
        }
    });
});
exports.lessonService = {
    createLessonIntoDB,
    getAllLessonsFromDB,
    getSingleLessonFromDB,
    deleteLessonFromDB,
};
