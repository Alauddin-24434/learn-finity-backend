"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.courseService = void 0;
const appError_1 = require("../errors/appError");
const prismaClient_1 = __importDefault(require("../lib/prismaClient"));
const createCourse = async (data) => {
    const exists = await prismaClient_1.default.course.findFirst({
        where: {
            title: data.title,
            authorId: data.authorId,
            isDeleted: false, // prevent duplicate check on deleted course
        },
    });
    if (exists)
        throw new appError_1.AppError(400, "Course with this title already exists for this author");
    return prismaClient_1.default.course.create({
        data: {
            title: data.title,
            thumbnail: data.thumbnail,
            overviewUrl: data.overviewUrl,
            price: Number(data.price),
            isFree: data.isFree ? true : false,
            description: data.description,
            authorId: data.authorId,
            categoryId: data.categoryId,
            features: data.features,
            stack: data.stack,
            overviews: data.overviews,
        },
    });
};
/**
 * @desc Get course by ID with lessons, author, category, and enrollment info
 * @param id - Course ID
 * @param userId - User ID (to check enrollment)
 * @returns Course object with lessonsCount, enrollmentsCount, isEnrolled
 * @throws AppError if course not found or deleted
 */
const getCourseById = async (id, userId) => {
    const course = await prismaClient_1.default.course.findUnique({
        where: { id, isDeleted: false }, // ✅ only active courses
        include: {
            // author: true,
            category: true,
            Videos: true,
        },
    });
    if (!course)
        throw new appError_1.AppError(404, "Course not found");
    const { Videos, ...rest } = course;
    return {
        ...rest,
        lessonsCount: Videos.length,
        // enrollmentsCount: await prisma..count({ where: { courseId: id } }),
    };
};
/**
 * @desc Get all courses with filters, pagination, sorting
 * @param query - category, searchTerm, sort, page, limit
 * @returns Object with courses, totalPages, currentPage, totalCourses
 */
const getAllCourses = async (query) => {
    let { category, searchTerm, sort, page, limit } = query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
    const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
    const skip = (pageNumber - 1) * limitNumber;
    const where = { isDeleted: false }; // ✅ only active courses
    if (category) {
        where.category = { name: { contains: category, mode: "insensitive" } };
    }
    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
        ];
    }
    let orderBy = {};
    if (sort === "price-asc")
        orderBy = { price: "asc" };
    else if (sort === "price-desc")
        orderBy = { price: "desc" };
    else
        orderBy = { createdAt: "desc" };
    const totalCourses = await prismaClient_1.default.course.count({ where });
    // const courses = await prisma.course.findMany({
    //   where,
    //   include: { author: true, category: true, lessons: true, enrollments: true },
    //   orderBy,
    //   skip,
    //   take: limitNumber,
    // });
    return {
        // courses: courses.map(({ lessons, enrollments, ...rest }) => ({
        //   ...rest,
        //   lessonsCount: lessons.length,
        //   enrollmentsCount: enrollments.length,
        // })),
        totalPages: Math.ceil(totalCourses / limitNumber),
        currentPage: pageNumber,
        totalCourses,
    };
};
/**
 * @desc Get all courses of a specific author
 * @param authorId - Author user ID
 * @returns Array of courses with author, category, and lessons
 */
const getCoursesByAuthor = async (authorId) => {
    return prismaClient_1.default.course.findMany({
        where: { authorId, isDeleted: false }, // ✅ only active courses
        include: {
            // author: true,
            category: true,
            // lessons: true,
        },
    });
};
/**
 * @desc Update course by ID
 * @param id - Course ID
 * @param data - Partial course data
 * @returns Updated course object
 * @throws AppError if course not found or deleted
 */
const updateCourseById = async (id, data) => {
    console.log("data1", data);
    const course = await prismaClient_1.default.course.findUnique({ where: { id, isDeleted: false } });
    // if (!course) throw new AppError(404, "Course not found");
    // return prisma.course.update({ where: { id }, data });
};
/**
 * @desc Soft delete a course by ID (sets isDeleted = true)
 * @param authorId - Course author's ID
 * @param id - Course ID
 * @returns Updated course object
 * @throws AppError if not found, already deleted, or unauthorized
 */
const softDeleteCourseById = async (authorId, id) => {
    const course = await prismaClient_1.default.course.findUnique({ where: { id } });
    if (!course || course.isDeleted) {
        throw new appError_1.AppError(404, "Course not found");
    }
    if (course.authorId !== authorId) {
        throw new appError_1.AppError(403, "You are not authorized to delete this course");
    }
    return prismaClient_1.default.course.update({
        where: { id },
        data: { isDeleted: true },
    });
};
/**
 * @desc Restore a soft-deleted course by ID
 * @param id - Course ID
 * @returns Updated course object
 * @throws AppError if course not found
 */
const restoreCourseById = async (id) => {
    const course = await prismaClient_1.default.course.findUnique({ where: { id } });
    if (!course)
        throw new appError_1.AppError(404, "Course not found");
    return prismaClient_1.default.course.update({
        where: { id },
        data: { isDeleted: false },
    });
};
exports.courseService = {
    createCourse,
    getCourseById,
    getAllCourses,
    getCoursesByAuthor,
    updateCourseById,
    softDeleteCourseById,
    restoreCourseById,
};
//# sourceMappingURL=course.services.js.map