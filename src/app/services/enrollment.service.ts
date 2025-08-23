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
 *        and format the result so that courses
 *        are returned in a root-level `courses` array.
 *
 * @param userId - ID of the user
 * @returns Array of courses with instructor (author) names included
 */
const getEnrollmentsByUserId = async (userId: string) => {
  // Fetch all enrollments for the user and include related course + author + counts
  const enrollments = await prisma.enrollment.findMany({
    where: { userId },
    include: {
      course: {
        include: {
          author: {
            select: { name: true }, // Only fetch author name
          },
          _count: {
            select: {
              lessons: true,       // Number of lessons in course
              enrollments: true,   // Number of students enrolled
            },
          },
        },
      },
    },
  });

  // Return only course info at root level + counts
  return enrollments.map((enrollment) => ({
    ...enrollment.course,
    authorName: enrollment.course.author?.name || "Unknown",
    lessonsCount: enrollment.course._count.lessons,
    enrollmentsCount: enrollment.course._count.enrollments,
  }));
};


/**
 * @desc Exported Enrollment Service
 */
export const enrollmentService = {
  createEnrollment,
  getEnrollmentsByUserId,
}
