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
 * @param userId - ID of the user
 * @returns Array of enrollments with course details included
 */
const getEnrollmentsByUserId = (userId) => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.enrollment.findMany({
        where: { userId },
        include: { course: true }, // Include course info
    });
});
/**
 * @desc Exported Enrollment Service
 */
exports.enrollmentService = {
    createEnrollment,
    getEnrollmentsByUserId,
};
