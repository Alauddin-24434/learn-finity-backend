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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonService = void 0;
const prisma_1 = require("../../lib/prisma");
const AppError_1 = require("../../error/AppError");
const cloudinary_1 = require("../../lib/cloudinary");
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
    catch (err) {
        // Rollback uploaded files if DB save fails
        if (videoPublicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
        }
        throw err;
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
const getLessonFromDByCourseId = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield prisma_1.prisma.lesson.findMany({
        where: { courseId },
        include: {
            lessonProgress: {
                where: { userId },
                select: { completed: true },
            },
            course: {
                select: { thumbnail: true },
            },
        },
        orderBy: { createdAt: "asc" },
    });
    if (lessons.length === 0) {
        throw new AppError_1.AppError(404, "Lessons not found");
    }
    // lessonProgress exclude করে শুধু isProgressCompleted রাখব
    return lessons.map((lesson) => {
        var _a;
        const { lessonProgress } = lesson, rest = __rest(lesson, ["lessonProgress"]); // lessonProgress remove
        return Object.assign(Object.assign({}, rest), { isProgressCompleted: ((_a = lessonProgress === null || lessonProgress === void 0 ? void 0 : lessonProgress[0]) === null || _a === void 0 ? void 0 : _a.completed) || false });
    });
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
            isDeleted: true,
        }
    });
});
const lessonProgressUpdate = (userId, lessonId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    const progress = yield prisma_1.prisma.lessonProgress.upsert({
        where: {
            userId_lessonId: { userId, lessonId }
        },
        update: {
            completed: true,
        },
        create: {
            userId,
            lessonId,
            courseId,
            completed: true,
        }
    });
    return progress;
});
exports.lessonService = {
    createLessonIntoDB,
    getAllLessonsFromDB,
    getLessonFromDByCourseId,
    deleteLessonFromDB,
    lessonProgressUpdate
};
