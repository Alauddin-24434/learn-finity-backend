// controllers/lesson.controller.ts

import { Request, Response } from "express";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { lessonService } from "./lession.service";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../error/AppError";

/**
 ========================================================================================
 * Create a new lesson
 ========================================================================================
 */


interface MulterFiles {

  video?: Express.Multer.File[];
}
export const createLesson = catchAsyncHandler(async (req: Request, res: Response) => {

  // Extract uploaded files
  const files = req.files as MulterFiles;

  const videoFile = files?.video?.[0];

  // Extract URLs & public IDs from Cloudinary upload
  const video = videoFile?.path;
  const videoPublicId = videoFile?.filename;


  const body = {
    ...req.body,
    video,
    videoPublicId,
  };

  const lesson = await lessonService.createLessonIntoDB(body);

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Lesson created successfully",
    data: lesson,
  });
});

/**
 ========================================================================================
 * Get all lessons
 ========================================================================================
 */
export const getAllLessons = catchAsyncHandler(async (_req: Request, res: Response) => {
  const lessons = await lessonService.getAllLessonsFromDB();

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lessons retrieved successfully",
    data: lessons,
  });
});

/**
 ========================================================================================
 * Get single lesson by ID
 ========================================================================================
 */
// controller
export const getLessonByCourseId = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id: courseId } = req.params;


  const userId = req.user?.id;
  if (!userId) throw new AppError(401, "Unauthorized");

  const lessons = await lessonService.getLessonFromDByCourseId(courseId, userId);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson retrieved successfully",
    data: lessons,
  });
});

/**
 ========================================================================================
 * Delete lesson by ID
 ========================================================================================
 */
export const deleteLesson = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const result = await lessonService.deleteLessonFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson deleted successfully",
    data: result,
  });
});


/**
 ========================================================================================
 * Update lesson progress for a user
 ========================================================================================
 */
export const updateLessonProgress = catchAsyncHandler(
  async (req: Request, res: Response) => {
    const userId = req.user?.id;
    if (!userId) throw new AppError(401, "Unauthorized");

    const { lessonId, courseId } = req.body;


    const progress = await lessonService.lessonProgressUpdate(userId, lessonId, courseId)


    sendResponse(res, {
      statusCode: 200,
      success: true,
      message: "Lesson progress updated successfully",
      data: progress,
    });
  }
);

export const lessonProgressController = {
  updateLessonProgress,
};

export const lessonController = {
  createLesson,
  getAllLessons,
  getLessonByCourseId,
  deleteLesson,
  updateLessonProgress
};
