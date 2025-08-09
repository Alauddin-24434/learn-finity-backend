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
const createCourse = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    const thumbnailUrl = (_a = req.file) === null || _a === void 0 ? void 0 : _a.path; // Cloudinary UR
    const bodyData = Object.assign(Object.assign({}, req.body), { thumbnail: thumbnailUrl });
    const course = yield course_service_1.courseService.createCourse(bodyData);
    res.status(201).json({ status: "success", data: course });
}));
const getCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_service_1.courseService.getCourseById(req.params.id);
    res.status(200).json({ status: "success", data: course });
}));
const getAllCourses = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const query = req.query;
    console.log("b", query);
    const courses = yield course_service_1.courseService.getAllCourses(query);
    res.status(200).json({ status: "success", data: courses });
}));
const updateCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield course_service_1.courseService.updateCourseById(req.params.id, req.body);
    res.status(200).json({ status: "success", data: course });
}));
const deleteCourseById = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    yield course_service_1.courseService.deleteCourseById(req.params.id);
    res.status(204).json({ status: "success", data: null });
}));
exports.courseController = {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourseById,
    deleteCourseById,
};
