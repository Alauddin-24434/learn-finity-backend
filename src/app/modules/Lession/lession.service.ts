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

 const getLessonFromDByCourseId =async (courseId: string, userId: string) => {
  const lessons = await prisma.lesson.findMany({
    where: { courseId },
    include: {
      lessonProgress: {
        where: { userId },
        select: { completed: true },
      },
      course: {
        select: { thumbnail: true },
      },
    },
    orderBy: { createdAt: "asc" },
  });

  if (lessons.length === 0) {
    throw new AppError(404, "Lessons not found");
  }

  // lessonProgress exclude করে শুধু isProgressCompleted রাখব
  return lessons.map((lesson) => {
    const { lessonProgress, ...rest } = lesson; // lessonProgress remove
    return {
      ...rest,
      isProgressCompleted: lessonProgress?.[0]?.completed || false,
    };
  });
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
      isDeleted: true,

    }
  });
};




const lessonProgressUpdate = async (
  userId: string,
  lessonId: string,
  courseId: string
) => {

  const progress = await prisma.lessonProgress.upsert({
    where: {
      userId_lessonId: { userId, lessonId }
    },
    update: {
      completed: true,

    },
    create: {
      userId,
      lessonId,
      courseId,
      completed: true,

    }
  })

  return progress

}



export const lessonService = {
  createLessonIntoDB,
  getAllLessonsFromDB,
  getLessonFromDByCourseId,
  deleteLessonFromDB,
  lessonProgressUpdate
};
