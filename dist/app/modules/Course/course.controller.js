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
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
const course_service_1 = require("./course.service");
/**
 =====================================================================================================
 * Create a new course
 ====================================================================================================
 */
const createCourse = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a, _b;
    const files = req.files;
    // Extract uploaded files
    const thumbnailFile = (_a = files === null || files === void 0 ? void 0 : files.thumbnail) === null || _a === void 0 ? void 0 : _a[0];
    const overviewVideoFile = (_b = files === null || files === void 0 ? void 0 : files.overviewVideo) === null || _b === void 0 ? void 0 : _b[0];
    // Extract URLs & public IDs from Cloudinary upload
    const thumbnail = thumbnailFile === null || thumbnailFile === void 0 ? void 0 : thumbnailFile.path;
    const thumbnailPublicId = thumbnailFile === null || thumbnailFile === void 0 ? void 0 : thumbnailFile.filename;
    const overviewVideo = overviewVideoFile === null || overviewVideoFile === void 0 ? void 0 : overviewVideoFile.path;
    const overviewVideoPublicId = overviewVideoFile === null || overviewVideoFile === void 0 ? void 0 : overviewVideoFile.filename;
    // Merge body with uploaded file data
    const bodyData = Object.assign(Object.assign({}, req.body), { thumbnail,
        thumbnailPublicId,
        overviewVideo,
        overviewVideoPublicId });
    // Save course to DB
    const course = yield course_service_1.courseService.createCourse(bodyData);
    res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
    });
}));
/**
 ==========================================================================================================
 * Get a course by ID
 ============================================================================================================
 */
const getCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_service_1.courseService.getCourseById(req.params.id);
    res.status(200).json({
        status: "success",
        data: course,
    });
}));
/**
 ===========================================================================================================
 * Get all courses with filters, pagination &
===========================================================================================================
 */
const getAllCourses = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const courses = yield course_service_1.courseService.getAllCourses(req.query);
    res.status(200).json({
        status: "success",
        data: courses,
    });
}));
/**
 ================================================================================================
 * Get courses created by the logged-in user
 =================================================================================================
 */
const getMyCourses = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const mixup = Object.assign(Object.assign({}, req.query), { id: (_a = req.user) === null || _a === void 0 ? void 0 : _a.id });
    const courses = yield course_service_1.courseService.getMyCourses(mixup);
    res.status(200).json({
        status: "success",
        data: courses,
    });
}));
/**
 =========================================================================================================
 * Update a course by ID
 ===========================================================================================================
 */
const updateCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_service_1.courseService.updateCourseById(req.params.id, req.body);
    res.status(200).json({
        status: "success",
        data: course,
    });
}));
/**
 ==============================================================================================================
 * Soft delete a course by
 =================================================================================================================
 */
const deleteCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield course_service_1.courseService.deleteCourseById(req.params.id);
    res.status(204).json({
        status: "success",
        data: null,
    });
}));
exports.courseController = {
    createCourse,
    getCourseById,
    getAllCourses,
    getMyCourses,
    updateCourseById,
    deleteCourseById,
};
