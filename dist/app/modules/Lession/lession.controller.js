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
exports.deleteLesson = exports.getSingleLesson = exports.getAllLessons = exports.createLesson = void 0;
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
const lession_service_1 = require("./lession.service");
const sendResponse_1 = require("../../utils/sendResponse");
exports.createLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lesson = yield (0, lession_service_1.createLessonIntoDB)(req.body);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 201,
        success: true,
        message: "Lesson created successfully",
        data: lesson,
    });
}));
exports.getAllLessons = (0, catchAsyncHandler_1.catchAsyncHandler)((_req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const lessons = yield (0, lession_service_1.getAllLessonsFromDB)();
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Lessons retrieved successfully",
        data: lessons,
    });
}));
exports.getSingleLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const lesson = yield (0, lession_service_1.getSingleLessonFromDB)(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Lesson retrieved successfully",
        data: lesson,
    });
}));
exports.deleteLesson = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { id } = req.params;
    const result = yield (0, lession_service_1.deleteLessonFromDB)(id);
    (0, sendResponse_1.sendResponse)(res, {
        statusCode: 200,
        success: true,
        message: "Lesson deleted successfully",
        data: result,
    });
}));
