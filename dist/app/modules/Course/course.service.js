"use strict";
// services/course.service.ts
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
exports.courseService = void 0;
const AppError_1 = require("../../error/AppError");
const cloudinary_1 = require("../../lib/cloudinary");
const prisma_1 = require("../../lib/prisma");
/**
 ===============================================================================
 * Create a new course
 ===============================================================================
 */
const createCourse = (data) => __awaiter(void 0, void 0, void 0, function* () {
    let thumbnailPublicId = data.thumbnailPublicId;
    let overviewVideoPublicId = data.overviewVideoPublicId;
    // Check for duplicate course by the same author
    const exists = yield prisma_1.prisma.course.findFirst({
        where: {
            title: data.title,
            authorId: data.authorId,
        },
    });
    if (exists) {
        throw new AppError_1.AppError(400, "Course with this title already exists for this author");
    }
    try {
        // Create course in DB
        return yield prisma_1.prisma.course.create({
            data: {
                title: data.title,
                thumbnail: data.thumbnail,
                thumbnailPublicId: data.thumbnailPublicId,
                overviewVideo: data.overviewVideo,
                overviewVideoPublicId,
                price: Number(data.price),
                isFree: Boolean(data.isFree),
                description: data.description,
                authorId: data.authorId,
                categoryId: data.categoryId,
                features: data.features,
                stack: data.stack,
                overviews: data.overviews,
            },
        });
    }
    catch (err) {
        // Rollback uploaded files if DB save fails
        if (thumbnailPublicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: "image" });
        }
        if (overviewVideoPublicId) {
            yield cloudinary_1.cloudinary.uploader.destroy(overviewVideoPublicId, { resource_type: "video" });
        }
        throw err;
    }
});
/**
 =================================================================================================
 * Get a course by ID (with related data)
 ===================================================================================================
 */
const getCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.prisma.course.findUnique({
        where: { id },
        include: {
            author: true,
            category: true,
            lessons: true,
            enrollments: true, // we only need the counts
        },
    });
    if (!course)
        throw new AppError_1.AppError(404, "Course not found");
    // Destructure lessons and enrollments, keep the rest
    const { lessons, enrollments } = course, rest = __rest(course, ["lessons", "enrollments"]);
    return Object.assign(Object.assign({}, rest), { lessonsCount: lessons.length, enrollmentsCount: enrollments.length });
});
/**
 ==================================================================================================
 * Get all courses with pagination, filtering, and sorting
 ========================================================================================================
 */
const getAllCourses = (query) => __awaiter(void 0, void 0, void 0, function* () {
    let { category, searchTerm, sort, page, limit } = query;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
    const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
    const skip = (pageNumber - 1) * limitNumber;
    const where = {};
    // Filter by category
    if (category) {
        where.category = {
            name: { contains: category, mode: "insensitive" },
        };
    }
    // Search by title or description
    if (searchTerm) {
        where.OR = [
            { title: { contains: searchTerm, mode: "insensitive" } },
            { description: { contains: searchTerm, mode: "insensitive" } },
        ];
    }
    // Sorting
    let orderBy = {};
    if (sort === "price-asc")
        orderBy = { price: "asc" };
    else if (sort === "price-desc")
        orderBy = { price: "desc" };
    else
        orderBy = { createdAt: "desc" };
    // Pagination count
    const totalCourses = yield prisma_1.prisma.course.count({ where });
    // Fetch paginated data
    const courses = yield prisma_1.prisma.course.findMany({
        where,
        include: {
            author: true,
            category: true,
            lessons: true,
            enrollments: true,
        },
        orderBy,
        skip,
        take: limitNumber,
    });
    // Transform to only include counts for lessons & enrollments
    const coursesWithCounts = courses.map((_a) => {
        var { lessons, enrollments } = _a, rest = __rest(_a, ["lessons", "enrollments"]);
        return (Object.assign(Object.assign({}, rest), { lessonsCount: lessons.length, enrollmentsCount: enrollments.length }));
    });
    return {
        courses: coursesWithCounts,
        totalPages: Math.ceil(totalCourses / limitNumber),
        currentPage: pageNumber,
        totalCourses,
    };
});
/**
 =============================================================================================================
 * Get courses of a specific author with earnings calculation
 ==============================================================================================================
 */
const getMyCourses = (params) => __awaiter(void 0, void 0, void 0, function* () {
    let { category, searchTerm, sort, page, limit, id } = params;
    page = parseInt(page, 10);
    limit = parseInt(limit, 10);
    const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
    const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
    const skip = (pageNumber - 1) * limitNumber;
    const where = {};
    // Filter only by the logged-in author's courses
    if (id)
        where.authorId = id;
    if (category) {
        where.category = {
            name: { contains: category, mode: "insensitive" },
        };
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
    const totalCourses = yield prisma_1.prisma.course.count({ where });
    // Include only paid payments
    const coursesData = yield prisma_1.prisma.course.findMany({
        where,
        include: {
            author: true,
            category: true,
            lessons: true,
            enrollments: true,
            payments: {
                where: { status: "PAID" },
                select: { amount: true, status: true },
            },
        },
        orderBy,
        skip,
        take: limitNumber,
    });
    // Calculate total earnings for each course
    const courses = coursesData.map(course => (Object.assign(Object.assign({}, course), { totalEarn: course.payments.reduce((sum, payment) => sum + payment.amount, 0) })));
    return {
        courses,
        totalPages: Math.ceil(totalCourses / limitNumber),
        currentPage: pageNumber,
        totalCourses,
    };
});
/**
 ==========================================================================================================
 * Update course by ID
 ===========================================================================================================
 */
const updateCourseById = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.prisma.course.findUnique({ where: { id } });
    if (!course)
        throw new AppError_1.AppError(404, "Course not found");
    return prisma_1.prisma.course.update({ where: { id }, data });
});
/**
 ===============================================================================================================
 * Soft delete course by ID
 ================================================================================================================
 */
const deleteCourseById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const course = yield prisma_1.prisma.course.findUnique({ where: { id } });
    if (!course)
        throw new AppError_1.AppError(404, "Course not found");
    return prisma_1.prisma.course.update({
        where: { id },
        data: { isDeleted: true },
    });
});
exports.courseService = {
    createCourse,
    getCourseById,
    getAllCourses,
    getMyCourses,
    updateCourseById,
    deleteCourseById,
};
