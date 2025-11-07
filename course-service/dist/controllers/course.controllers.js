"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseController = void 0;
const catchAsync_1 = require("../utils/catchAsync");
const course_validations_1 = require("../validations/course.validations");
const course_services_1 = require("../services/course.services");
const createCourse = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    // ✅ Step 1: Validate body (non-file fields)
    const validatedData = course_validations_1.createCourseSchema.parse(req.body);
    const files = req.files;
    const thumbnailFile = files?.thumbnail?.[0];
    const overviewVideoFile = files?.overviewUrl?.[0];
    const thumbnail = thumbnailFile?.path;
    const overviewUrl = overviewVideoFile?.path;
    if (!thumbnail || !overviewUrl) {
        return res.status(400).json({ message: "Thumbnail and overviewUrl are required" });
    }
    const fullBody = {
        ...validatedData,
        thumbnail,
        overviewUrl,
    };
    const course = await course_services_1.courseService.createCourse(fullBody);
    res.status(201).json({
        success: true,
        message: "Course created successfully",
        data: course,
    });
});
const getCourseById = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const course = await course_services_1.courseService.getCourseById(req.params.id, req.user?.id);
    res.status(200).json({ status: "success", data: course });
});
const getCoursesByAuthor = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const { authorId } = req.params;
    const courses = await course_services_1.courseService.getCoursesByAuthor(authorId);
    res.status(200).json({
        success: true,
        data: courses,
        message: `Courses by author ${authorId} fetched successfully`,
    });
});
const getAllCourses = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const courses = await course_services_1.courseService.getAllCourses(req.query);
    res.status(200).json({ status: "success", data: courses });
});
const updateCourseById = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    console.log("req=>", req.body);
    const id = req.params.id;
    const course = await course_services_1.courseService.updateCourseById(id, req.body);
    res.status(200).json({ status: "success", data: course });
});
const softDeleteCourseById = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    const authorId = req.user?.id;
    await course_services_1.courseService.softDeleteCourseById(authorId, req.params.id);
    res.status(200).json({ status: "success", message: "Course soft-deleted successfully" });
});
const restoreCourseById = (0, catchAsync_1.catchAsyncHandler)(async (req, res) => {
    await course_services_1.courseService.restoreCourseById(req.params.id);
    res.status(200).json({ status: "success", message: "Course restored successfully" });
});
exports.courseController = {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourseById,
    softDeleteCourseById,
    restoreCourseById,
    getCoursesByAuthor
};
//# sourceMappingURL=course.controllers.js.map