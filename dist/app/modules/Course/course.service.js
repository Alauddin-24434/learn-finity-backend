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
exports.courseService = void 0;
// services/course.service.ts
const AppError_1 = require("../../error/AppError");
const prisma_1 = require("../../lib/prisma");
const createCourse = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const exists = yield prisma_1.prisma.course.findFirst({
        where: { title: data.title },
    });
    if (exists)
        throw new AppError_1.AppError(400, "Course with this title already exists");
    return prisma_1.prisma.course.create({ data });
});
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.prisma.course.findUnique({
        where: { id },
        include: {
            author: true,
            category: true,
            lessons: true,
            enrollments: true,
        },
    });
    if (!course)
        throw new AppError_1.AppError(404, "Course not found");
    return course;
});
const getAllCourses = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.course.findMany({
        where: {},
        include: {
            author: true,
            category: true,
        },
    });
});
const updateCourseById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.prisma.course.findUnique({ where: { id } });
    if (!course)
        throw new AppError_1.AppError(404, "Course not found");
    return prisma_1.prisma.course.update({ where: { id }, data });
});
const deleteCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.prisma.course.findUnique({ where: { id } });
    if (!course)
        throw new AppError_1.AppError(404, "Course not found");
    return prisma_1.prisma.course.delete({ where: { id } });
});
exports.courseService = {
    createCourse,
    getCourseById,
    getAllCourses,
    updateCourseById,
    deleteCourseById,
};
