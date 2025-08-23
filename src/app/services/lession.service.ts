import { prisma } from "../lib/prisma"
import { ILesson } from "../interfaces/lession.interface"
import { AppError } from "../error/AppError"
import { cloudinary } from "../lib/cloudinary"

/**
 * @desc Create a new lesson in the database.
 *        If DB creation fails, delete uploaded video from Cloudinary (rollback).
 * @param payload - Lesson data including title, duration, courseId, video, videoPublicId
 * @returns Created lesson object
 * @throws Throws error if DB operation fails
 */
const createLessonIntoDB = async (payload: ILesson) => {
  let videoPublicId = payload.videoPublicId

  try {
    return await prisma.lesson.create({
      data: {
        title: payload.title,
        duration: payload.duration,
        courseId: payload.courseId,
        video: payload.video,
        videoPublicId,
      },
    })
  } catch (err) {
    // Rollback uploaded video if DB creation fails
    if (videoPublicId) {
      await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" })
    }
    throw err
  }
}

/**
 * @desc Get all lessons (excluding soft-deleted)
 * @returns Array of lesson objects with course details
 */
const getAllLessonsFromDB = async () => {
  return prisma.lesson.findMany({
    where: { isDeleted: false },
    include: { course: true },
  })
}

/**
 * @desc Get lessons of a specific course for a specific user
 * @param courseId - ID of the course
 * @param userId - ID of the user
 * @returns Array of lessons with `isProgressCompleted` field
 * @throws Throws 404 error if no lessons found
 */
const getLessonFromDByCourseId = async (courseId: string, userId: string) => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId, isDeleted: false },
    include: {
      lessonProgress: {
        where: { userId },
        select: { completed: true },
      },
      course: { select: { thumbnail: true } },
    },
    orderBy: { createdAt: "asc" },
  })

  if (!lessons.length) throw new AppError(404, "Lessons not found")

  return lessons.map((lesson) => {
    const { lessonProgress, ...rest } = lesson
    return { ...rest, isProgressCompleted: lessonProgress?.[0]?.completed || false }
  })
}

/**
 * @desc Soft delete a lesson (mark as deleted)
 * @param id - ID of the lesson
 * @returns Updated lesson object
 * @throws Throws 404 error if lesson not found
 */
const deleteLessonFromDB = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  if (!lesson) throw new AppError(404, "Lesson not found")

  return prisma.lesson.update({
    where: { id },
    data: { isDeleted: true },
  })
}

/**
 * @desc Restore a soft-deleted lesson
 * @param id - ID of the lesson
 * @returns Updated lesson object
 * @throws Throws 404 error if lesson not found
 */
const restoreLessonFromDB = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id } })
  if (!lesson) throw new AppError(404, "Lesson not found")

  return prisma.lesson.update({
    where: { id },
    data: { isDeleted: false },
  })
}

/**
 * @desc Mark a lesson as completed for a user (or create progress if not exists)
 * @param userId - ID of the user
 * @param lessonId - ID of the lesson
 * @param courseId - ID of the course
 * @returns Upserted lesson progress object
 */
const lessonProgressUpdate = async (userId: string, lessonId: string, courseId: string) => {
  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true },
    create: { userId, lessonId, courseId, completed: true },
  })
}

/**
 * @desc Exported Lesson Service
 */
export const lessonService = {
  createLessonIntoDB,
  getAllLessonsFromDB,
  getLessonFromDByCourseId,
  deleteLessonFromDB,
  restoreLessonFromDB,
  lessonProgressUpdate,
}
