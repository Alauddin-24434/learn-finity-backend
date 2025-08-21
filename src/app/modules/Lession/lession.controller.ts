import { Request, Response } from "express";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { lessonService } from "./lession.service";
import { sendResponse } from "../../utils/sendResponse";
import { AppError } from "../../error/AppError";

interface MulterFiles {
  video?: Express.Multer.File[];
}

/**
 * Create a lesson
 */
const createLesson = catchAsyncHandler(async (req: Request, res: Response) => {
  const files = req.files as MulterFiles;
  const videoFile = files?.video?.[0];

  const body = {
    ...req.body,
    video: videoFile?.path,
    videoPublicId: videoFile?.filename,
  };

  const lesson = await lessonService.createLessonIntoDB(body);
  sendResponse(res, { statusCode: 201, success: true, message: "Lesson created successfully", data: lesson });
});

/**
 * Get all lessons
 */
const getAllLessons = catchAsyncHandler(async (req: Request, res: Response) => {
  const lessons = await lessonService.getAllLessonsFromDB();
  sendResponse(res, { statusCode: 200, success: true, message: "Lessons retrieved successfully", data: lessons });
});

/**
 * Get lessons by course ID
 */
const getLessonByCourseId = catchAsyncHandler(async (req: Request, res: Response) => {
  const courseId = req.params.id;
  const userId = req.user?.id;
  if (!userId) throw new AppError(401, "Unauthorized");

  const lessons = await lessonService.getLessonFromDByCourseId(courseId, userId);
  sendResponse(res, { statusCode: 200, success: true, message: "Lessons retrieved successfully", data: lessons });
});

/**
 * Soft delete a lesson
 */
const softDeleteLessonById = catchAsyncHandler(async (req: Request, res: Response) => {
  await lessonService.deleteLessonFromDB(req.params.id);
  sendResponse(res, { statusCode: 204, success: true, message: "Lesson soft deleted", data: null });
});

/**
 * Restore a lesson
 */
const restoreLessonById = catchAsyncHandler(async (req: Request, res: Response) => {
  const lesson = await lessonService.restoreLessonFromDB(req.params.id);
  sendResponse(res, { statusCode: 200, success: true, message: "Lesson restored successfully", data: lesson });
});

/**
 * Update lesson progress
 */
const updateLessonProgress = catchAsyncHandler(async (req: Request, res: Response) => {
  const userId = req.user?.id;
  if (!userId) throw new AppError(401, "Unauthorized");

  const { lessonId, courseId } = req.body;
  const progress = await lessonService.lessonProgressUpdate(userId, lessonId, courseId);
  sendResponse(res, { statusCode: 200, success: true, message: "Lesson progress updated successfully", data: progress });
});

export const lessonController = {
  createLesson,
  getAllLessons,
  getLessonByCourseId,
  softDeleteLessonById,
  restoreLessonById,
  updateLessonProgress,
};
