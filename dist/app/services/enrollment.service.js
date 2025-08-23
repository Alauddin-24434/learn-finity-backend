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
exports.enrollmentService = void 0;
// services/enrollment.service.ts
const prisma_1 = require("../lib/prisma");
/**
 * @desc Create a new enrollment for a user in a course
 * @param data - Enrollment details (userId, courseId, etc.)
 * @returns Created enrollment object
 */
const createEnrollment = (data) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.enrollment.create({ data });
});
/**
 * @desc Get all enrollments of a specific user
 *        and format the result so that courses
 *        are returned in a root-level `courses` array.
 *
 * @param userId - ID of the user
 * @returns Array of courses with instructor (author) names included
 */
const getEnrollmentsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    // Fetch all enrollments for the user and include related course + author + counts
    const enrollments = yield prisma_1.prisma.enrollment.findMany({
        where: { userId },
        include: {
            course: {
                include: {
                    author: {
                        select: { name: true }, // Only fetch author name
                    },
                    _count: {
                        select: {
                            lessons: true, // Number of lessons in course
                            enrollments: true, // Number of students enrolled
                        },
                    },
                },
            },
        },
    });
    // Return only course info at root level + counts
    return enrollments.map((enrollment) => {
        var _a;
        return (Object.assign(Object.assign({}, enrollment.course), { authorName: ((_a = enrollment.course.author) === null || _a === void 0 ? void 0 : _a.name) || "Unknown", lessonsCount: enrollment.course._count.lessons, enrollmentsCount: enrollment.course._count.enrollments }));
    });
});
/**
 * @desc Exported Enrollment Service
 */
exports.enrollmentService = {
    createEnrollment,
    getEnrollmentsByUserId,
};
