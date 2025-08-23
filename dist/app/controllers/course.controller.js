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
exports.courseController = void 0;
const catchAsyncHandler_1 = require("../utils/catchAsyncHandler");
const course_service_1 = require("../services/course.service");
const createCourse = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files;
    const thumbnailFile = (_a = files === null || files === void 0 ? void 0 : files.thumbnail) === null || _a === void 0 ? void 0 : _a[0];
    const overviewVideoFile = (_b = files === null || files === void 0 ? void 0 : files.overviewVideo) === null || _b === void 0 ? void 0 : _b[0];
    const thumbnail = thumbnailFile === null || thumbnailFile === void 0 ? void 0 : thumbnailFile.path;
    const thumbnailPublicId = thumbnailFile === null || thumbnailFile === void 0 ? void 0 : thumbnailFile.filename;
    const overviewVideo = overviewVideoFile === null || overviewVideoFile === void 0 ? void 0 : overviewVideoFile.path;
    const overviewVideoPublicId = overviewVideoFile === null || overviewVideoFile === void 0 ? void 0 : overviewVideoFile.filename;
    const bodyData = Object.assign(Object.assign({}, req.body), { thumbnail, thumbnailPublicId, overviewVideo, overviewVideoPublicId });
    console.log(bodyData);
    const course = yield course_service_1.courseService.createCourse(bodyData);
    res.status(201).json({ success: true, message: "Course created successfully", data: course });
}));
const getCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const course = yield course_service_1.courseService.getCourseById(req.params.id, (_a = req.user) === null || _a === void 0 ? void 0 : _a.id);
    res.status(200).json({ status: "success", data: course });
}));
const getCoursesByAuthor = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { authorId } = req.params;
    const courses = yield course_service_1.courseService.getCoursesByAuthor(authorId);
    res.status(200).json({
        success: true,
        data: courses,
        message: `Courses by author ${authorId} fetched successfully`,
    });
}));
const getAllCourses = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_service_1.courseService.getAllCourses(req.query);
    res.status(200).json({ status: "success", data: courses });
}));
const updateCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_service_1.courseService.updateCourseById(req.params.id, req.body);
    res.status(200).json({ status: "success", data: course });
}));
const softDeleteCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield course_service_1.courseService.softDeleteCourseById(req.params.id);
    res.status(200).json({ status: "success", message: "Course soft-deleted successfully" });
}));
const restoreCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield course_service_1.courseService.restoreCourseById(req.params.id);
    res.status(200).json({ status: "success", message: "Course restored successfully" });
}));
exports.courseController = {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourseById,
    softDeleteCourseById,
    restoreCourseById,
    getCoursesByAuthor
};
