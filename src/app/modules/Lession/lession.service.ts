// services/lesson.service.ts


import { prisma } from "../../lib/prisma";
import { ILesson } from "./lession.interface";
import { AppError } from "../../error/AppError";
import { cloudinary } from "../../lib/cloudinary";


/**
 ========================================================================================
 * Create a new lesson with rollback for uploaded video if DB fails
 ========================================================================================
 */
const createLessonIntoDB = async (payload: ILesson) => {
  let videoPublicId = payload.videoPublicId;

  try {
    // Create the lesson record in DB
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
    // Rollback uploaded files if DB save fails
    if (videoPublicId) {
      await cloudinary.uploader.destroy(videoPublicId, { resource_type: "video" });
    }
 
    throw err;
  }
};


/**
 ========================================================================================
 * Get all lessons with related course info
 ========================================================================================
 */
const getAllLessonsFromDB = async () => {
  return prisma.lesson.findMany({
    include: { course: true },
  });
};

/**
 ========================================================================================
 * Get a single lesson by ID (with related course)
 ========================================================================================
 */
const getSingleLessonFromDB = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({
    where: { id },
    include: { course: true },
  });
  if (!lesson) throw new AppError(404, "Lesson not found");
  return lesson;
};

/**
 ========================================================================================
 * Delete lesson by ID (hard delete)
 ========================================================================================
 */
const deleteLessonFromDB = async (id: string) => {
  const lesson = await prisma.lesson.findUnique({ where: { id } });
  if (!lesson) throw new AppError(404, "Lesson not found");

  return prisma.lesson.update({
    where: { id },
    data: {
      isDeleted: true
    }
  });
};

export const lessonService = {
  createLessonIntoDB,
  getAllLessonsFromDB,
  getSingleLessonFromDB,
  deleteLessonFromDB,
};
