// services/enrollment.service.ts
import { prisma } from "../lib/prisma"
import { IEnrollment } from "../interfaces/enrollment.interface"

/**
 * @desc Create a new enrollment for a user in a course
 * @param data - Enrollment details (userId, courseId, etc.)
 * @returns Created enrollment object
 */
const createEnrollment = async (data: IEnrollment) => {
  return prisma.enrollment.create({ data })
}

/**
 * @desc Get all enrollments of a specific user
 * @param userId - ID of the user
 * @returns Array of enrollments with course details included
 */
const getEnrollmentsByUserId = async (userId: string) => {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { course: true }, // Include course info
  })
}

/**
 * @desc Exported Enrollment Service
 */
export const enrollmentService = {
  createEnrollment,
  getEnrollmentsByUserId,
}
