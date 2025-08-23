"use strict";
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
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../error/AppError");
const cloudinary_1 = require("../lib/cloudinary");
/**
 * @desc Create a new lesson in the database.
 *        If DB creation fails, delete uploaded video from Cloudinary (rollback).
 * @param payload - Lesson data including title, duration, courseId, video, videoPublicId
 * @returns Created lesson object
 * @throws Throws error if DB operation fails
 */
const createLessonIntoDB = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    let videoPublicId = payload.videoPublicId;
    try {
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
        // Rollback uploaded video if DB creation fails
        if (videoPublicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
        }
        throw err;
    }
});
/**
 * @desc Get all lessons (excluding soft-deleted)
 * @returns Array of lesson objects with course details
 */
const getAllLessonsFromDB = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.lesson.findMany({
        where: { isDeleted: false },
        include: { course: true },
    });
});
/**
 * @desc Get lessons of a specific course for a specific user
 * @param courseId - ID of the course
 * @param userId - ID of the user
 * @returns Array of lessons with `isProgressCompleted` field
 * @throws Throws 404 error if no lessons found
 */
const getLessonFromDByCourseId = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield prisma_1.prisma.lesson.findMany({
        where: { courseId, isDeleted: false },
        include: {
            lessonProgress: {
                where: { userId },
                select: { completed: true },
            },
            course: { select: { thumbnail: true } },
        },
        orderBy: { createdAt: "asc" },
    });
    if (!lessons.length)
        throw new AppError_1.AppError(404, "Lessons not found");
    return lessons.map((lesson) => {
        var _a;
        const { lessonProgress } = lesson, rest = __rest(lesson, ["lessonProgress"]);
        return Object.assign(Object.assign({}, rest), { isProgressCompleted: ((_a = lessonProgress === null || lessonProgress === void 0 ? void 0 : lessonProgress[0]) === null || _a === void 0 ? void 0 : _a.completed) || false });
    });
});
/**
 * @desc Soft delete a lesson (mark as deleted)
 * @param id - ID of the lesson
 * @returns Updated lesson object
 * @throws Throws 404 error if lesson not found
 */
const deleteLessonFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield prisma_1.prisma.lesson.findUnique({ where: { id } });
    if (!lesson)
        throw new AppError_1.AppError(404, "Lesson not found");
    return prisma_1.prisma.lesson.update({
        where: { id },
        data: { isDeleted: true },
    });
});
/**
 * @desc Restore a soft-deleted lesson
 * @param id - ID of the lesson
 * @returns Updated lesson object
 * @throws Throws 404 error if lesson not found
 */
const restoreLessonFromDB = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield prisma_1.prisma.lesson.findUnique({ where: { id } });
    if (!lesson)
        throw new AppError_1.AppError(404, "Lesson not found");
    return prisma_1.prisma.lesson.update({
        where: { id },
        data: { isDeleted: false },
    });
});
/**
 * @desc Mark a lesson as completed for a user (or create progress if not exists)
 * @param userId - ID of the user
 * @param lessonId - ID of the lesson
 * @param courseId - ID of the course
 * @returns Upserted lesson progress object
 */
const lessonProgressUpdate = (userId, lessonId, courseId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.lessonProgress.upsert({
        where: { userId_lessonId: { userId, lessonId } },
        update: { completed: true },
        create: { userId, lessonId, courseId, completed: true },
    });
});
/**
 * @desc Exported Lesson Service
 */
exports.lessonService = {
    createLessonIntoDB,
    getAllLessonsFromDB,
    getLessonFromDByCourseId,
    deleteLessonFromDB,
    restoreLessonFromDB,
    lessonProgressUpdate,
};
