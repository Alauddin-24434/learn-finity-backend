// controllers/course.controller.ts
import { Request, Response } from "express";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { courseService } from "./course.service";

/**
 ===================================================================================================
 * Custom Multer file type for type-safety
 ===================================================================================================
 */
interface MulterFiles {
  thumbnail?: Express.Multer.File[];
  overviewVideo?: Express.Multer.File[];
}

/**
 =====================================================================================================
 * Create a new course
 ====================================================================================================
 */
const createCourse = catchAsyncHandler(async (req: Request, res: Response) => {
  const files = req.files as MulterFiles;

  // Extract uploaded files
  const thumbnailFile = files?.thumbnail?.[0];
  const overviewVideoFile = files?.overviewVideo?.[0];

  // Extract URLs & public IDs from Cloudinary upload
  const thumbnail = thumbnailFile?.path;
  const thumbnailPublicId = thumbnailFile?.filename;
  const overviewVideo = overviewVideoFile?.path;
  const overviewVideoPublicId = overviewVideoFile?.filename;

  // Merge body with uploaded file data
  const bodyData = {
    ...req.body,
    thumbnail,
    thumbnailPublicId,
    overviewVideo,
    overviewVideoPublicId,
  };

  // Save course to DB
  const course = await courseService.createCourse(bodyData);

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

/**
 ==========================================================================================================
 * Get a course by ID
 ============================================================================================================
 */
const getCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const userId=req.user?.id;
  const course = await courseService.getCourseById(req.params.id, userId as string);
  res.status(200).json({
    status: "success",
    data: course,
  });
});

/**
 ===========================================================================================================
 * Get all courses with filters, pagination & 
===========================================================================================================
 */
const getAllCourses = catchAsyncHandler(async (req: Request, res: Response) => {
  const courses = await courseService.getAllCourses(req.query);
  res.status(200).json({
    status: "success",
    data: courses,
  });
});

/**
 ================================================================================================
 * Get courses created by the logged-in user
 =================================================================================================
 */
const getMyCourses = catchAsyncHandler(async (req: Request, res: Response) => {
  const mixup = {
    ...req.query,
    id: req.user?.id,
  };
  const courses = await courseService.getMyCourses(mixup);
  res.status(200).json({
    status: "success",
    data: courses,
  });
});

/**
 =========================================================================================================
 * Update a course by ID
 ===========================================================================================================
 */
const updateCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.updateCourseById(req.params.id, req.body);
  res.status(200).json({
    status: "success",
    data: course,
  });
});

/**
 ==============================================================================================================
 * Soft delete a course by 
 =================================================================================================================
 */
const deleteCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  await courseService.deleteCourseById(req.params.id);
  res.status(204).json({
    status: "success",
    data: null,
  });
});

export const courseController = {
  createCourse,
  getCourseById,
  getAllCourses,
  getMyCourses,
  updateCourseById,
  deleteCourseById,
};
