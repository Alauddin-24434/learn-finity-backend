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
Object.defineProperty(exports, "__esModule", { value: true });
exports.lessonController = void 0;
const catchAsyncHandler_1 = require("../utils/catchAsyncHandler");
const lession_service_1 = require("../services/lession.service");
const sendResponse_1 = require("../utils/sendResponse");
const AppError_1 = require("../error/AppError");
/**
 * Create a lesson
 */
const createLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const files = req.files;
    const videoFile = (_a = files === null || files === void 0 ? void 0 : files.video) === null || _a === void 0 ? void 0 : _a[0];
    const body = Object.assign(Object.assign({}, req.body), { video: videoFile === null || videoFile === void 0 ? void 0 : videoFile.path });
    const lesson = yield lession_service_1.lessonService.createLessonIntoDB(body);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 201, success: true, message: "Lesson created successfully", data: lesson });
}));
/**
 * Get all lessons
 */
const getAllLessons = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield lession_service_1.lessonService.getAllLessonsFromDB();
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Lessons retrieved successfully", data: lessons });
}));
/**
 * Get lessons by course ID
 */
const getLessonByCourseId = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const courseId = req.params.id;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new AppError_1.AppError(401, "Unauthorized");
    const lessons = yield lession_service_1.lessonService.getLessonFromDByCourseId(courseId, userId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Lessons retrieved successfully", data: lessons });
}));
/**
 * Soft delete a lesson
 */
const softDeleteLessonById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield lession_service_1.lessonService.deleteLessonFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 204, success: true, message: "Lesson soft deleted", data: null });
}));
/**
 * Restore a lesson
 */
const restoreLessonById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield lession_service_1.lessonService.restoreLessonFromDB(req.params.id);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Lesson restored successfully", data: lesson });
}));
/**
 * Update lesson progress
 */
const updateLessonProgress = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const userId = (_a = req.user) === null || _a === void 0 ? void 0 : _a.id;
    if (!userId)
        throw new AppError_1.AppError(401, "Unauthorized");
    const { lessonId, courseId } = req.body;
    const progress = yield lession_service_1.lessonService.lessonProgressUpdate(userId, lessonId, courseId);
    (0, sendResponse_1.sendResponse)(res, { statusCode: 200, success: true, message: "Lesson progress updated successfully", data: progress });
}));
exports.lessonController = {
    createLesson,
    getAllLessons,
    getLessonByCourseId,
    softDeleteLessonById,
    restoreLessonById,
    updateLessonProgress,
};
