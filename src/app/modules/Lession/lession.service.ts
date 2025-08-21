import { prisma } from "../../lib/prisma";
import { ILesson } from "./lession.interface";
import { AppError } from "../../error/AppError";
import { cloudinary } from "../../lib/cloudinary";

/**
 * Create a new lesson with rollback for uploaded video if DB fails
 */
const createLessonIntoDB = async (payload: ILesson) => {
  let videoPublicId = payload.videoPublicId;

  try {
    return await prisma.lesson.create({
      data: {
        title: payload.title,
        duration: payload.duration,
        courseId: payload.courseId,
        video: payload.video,
        videoPublicId,
      },
    });
  } catch (err) {
    if (videoPublicId) {
      await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
    }
    throw err;
  }
};

/**
 * Get all lessons
 */
const getAllLessonsFromDB = async () => {
  return prisma.lesson.findMany({
    where: { isDeleted: false },
    include: { course: true },
  });
};

/**
 * Get lessons by course ID for a specific user
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
  });

  if (!lessons.length) throw new AppError(404, "Lessons not found");

  return lessons.map((lesson) => {
    const { lessonProgress, ...rest } = lesson;
    return { ...rest, isProgressCompleted: lessonProgress?.[0]?.completed || false };
  });
};

/**
 * Soft delete a lesson
 */
const deleteLessonFromDB = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new AppError(404, "Lesson not found");

  return prisma.lesson.update({
    where: { id },
    data: { isDeleted: true },
  });
};

/**
 * Restore a soft-deleted lesson
 */
const restoreLessonFromDB = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new AppError(404, "Lesson not found");

  return prisma.lesson.update({
    where: { id },
    data: { isDeleted: false },
  });
};

/**
 * Update lesson progress
 */
const lessonProgressUpdate = async (userId: string, lessonId: string, courseId: string) => {
  return prisma.lessonProgress.upsert({
    where: { userId_lessonId: { userId, lessonId } },
    update: { completed: true },
    create: { userId, lessonId, courseId, completed: true },
  });
};

export const lessonService = {
  createLessonIntoDB,
  getAllLessonsFromDB,
  getLessonFromDByCourseId,
  deleteLessonFromDB,
  restoreLessonFromDB,
  lessonProgressUpdate,
};
