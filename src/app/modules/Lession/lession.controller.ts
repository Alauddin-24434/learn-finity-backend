// controllers/lesson.controller.ts

import { Request, Response } from "express";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { lessonService } from "./lession.service";
import { sendResponse } from "../../utils/sendResponse";

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
  const videoPublicId =videoFile?.filename;


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
export const getSingleLesson = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const lesson = await lessonService.getSingleLessonFromDB(id);

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson retrieved successfully",
    data: lesson,
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

export const lessonController = {
  createLesson,
  getAllLessons,
  getSingleLesson,
  deleteLesson,
};
