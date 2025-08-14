"use strict";
// controllers/lesson.controller.ts
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
exports.lessonController = exports.deleteLesson = exports.getSingleLesson = exports.getAllLessons = exports.createLesson = void 0;
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
const lession_service_1 = require("./lession.service");
const sendResponse_1 = require("../../utils/sendResponse");
exports.createLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    // Extract uploaded files
    const files = req.files;
    const videoFile = (_a = files === null || files === void 0 ? void 0 : files.video) === null || _a === void 0 ? void 0 : _a[0];
    // Extract URLs & public IDs from Cloudinary upload
    const video = videoFile === null || videoFile === void 0 ? void 0 : videoFile.path;
    const videoPublicId = videoFile === null || videoFile === void 0 ? void 0 : videoFile.filename;
    const body = Object.assign(Object.assign({}, req.body), { video,
        videoPublicId });
    const lesson = yield lession_service_1.lessonService.createLessonIntoDB(body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Lesson created successfully",
        data: lesson,
    });
}));
/**
 ========================================================================================
 * Get all lessons
 ========================================================================================
 */
exports.getAllLessons = (0, catchAsyncHandler_1.catchAsyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield lession_service_1.lessonService.getAllLessonsFromDB();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Lessons retrieved successfully",
        data: lessons,
    });
}));
/**
 ========================================================================================
 * Get single lesson by ID
 ========================================================================================
 */
exports.getSingleLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const lesson = yield lession_service_1.lessonService.getSingleLessonFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Lesson retrieved successfully",
        data: lesson,
    });
}));
/**
 ========================================================================================
 * Delete lesson by ID
 ========================================================================================
 */
exports.deleteLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield lession_service_1.lessonService.deleteLessonFromDB(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Lesson deleted successfully",
        data: result,
    });
}));
exports.lessonController = {
    createLesson: exports.createLesson,
    getAllLessons: exports.getAllLessons,
    getSingleLesson: exports.getSingleLesson,
    deleteLesson: exports.deleteLesson,
};
