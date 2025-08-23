import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/catchAsyncHandler";
import { courseService } from "../services/course.service";

interface MulterFiles {
  thumbnail?: Express.Multer.File[];
  overviewVideo?: Express.Multer.File[];
}

const createCourse = catchAsyncHandler(async (req: Request, res: Response) => {
  const files = req.files as MulterFiles;

  const thumbnailFile = files?.thumbnail?.[0];
  const overviewVideoFile = files?.overviewVideo?.[0];

  const thumbnail = thumbnailFile?.path;
  const thumbnailPublicId = thumbnailFile?.filename;
  const overviewVideo = overviewVideoFile?.path;
  const overviewVideoPublicId = overviewVideoFile?.filename;

  const bodyData = { ...req.body, thumbnail, thumbnailPublicId, overviewVideo, overviewVideoPublicId };
  console.log(bodyData)
  const course = await courseService.createCourse(bodyData);

  res.status(201).json({ success: true, message: "Course created successfully", data: course });
});

const getCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseById(req.params.id, req.user?.id as string);
  res.status(200).json({ status: "success", data: course });
});



const getCoursesByAuthor = catchAsyncHandler(async (req: Request, res: Response) => {
    const { authorId } = req.params;

    const courses = await courseService.getCoursesByAuthor(authorId);

    res.status(200).json({
      success: true,
      data: courses,
      message: `Courses by author ${authorId} fetched successfully`,
    });
  } )




const getAllCourses = catchAsyncHandler(async (req: Request, res: Response) => {
  const courses = await courseService.getAllCourses(req.query);
  res.status(200).json({ status: "success", data: courses });
});

const updateCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.updateCourseById(req.params.id, req.body);
  res.status(200).json({ status: "success", data: course });
});

const softDeleteCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  await courseService.softDeleteCourseById(req.params.id);
  res.status(200).json({ status: "success", message: "Course soft-deleted successfully" });
});

const restoreCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  await courseService.restoreCourseById(req.params.id);
  res.status(200).json({ status: "success", message: "Course restored successfully" });
});

export const courseController = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  softDeleteCourseById,
  restoreCourseById,
  getCoursesByAuthor
};
