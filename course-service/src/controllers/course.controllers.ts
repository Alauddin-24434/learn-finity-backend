import { Request, Response } from "express";
import { catchAsyncHandler } from "../utils/catchAsync";
import { createCourseSchema } from "../validations/course.validations";
import { courseService } from "../services/course.services";
import { ICourse, MulterFiles } from "../interfaces/course.interfaces";


const createCourse = catchAsyncHandler(async (req: Request, res: Response) => {

  const validatedData = createCourseSchema.parse(req.body);




 
  const course = await courseService.createCourse(validatedData);

  res.status(201).json({
    success: true,
    message: "Course created successfully",
    data: course,
  });
});

const createCourseCategory = catchAsyncHandler(async (req: Request, res: Response) => {
   const category = await courseService.createCourseCategory(req.body);

  res.status(201).json({
    success: true,
    message: "Category created successfully",
    data: category,
  });
})

const getCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseById(req.params.id as string, req.user?.id as string);
  res.status(200).json({ status: "success", data: course });
});



const getCoursesByAuthor = catchAsyncHandler(async (req: Request, res: Response) => {
    const { authorId } = req.params;

    const courses = await courseService.getCoursesByAuthor(authorId as string);

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
  console.log("req=>",req.body)
  const id= req.params.id;
  const course = await courseService.updateCourseById(id as string, req.body);
  res.status(200).json({ status: "success", data: course });
});

const softDeleteCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const authorId = req.user?.id;
  await courseService.softDeleteCourseById(authorId  as string,req.params.id as string);
  res.status(200).json({ status: "success", message: "Course soft-deleted successfully" });
});

const restoreCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  await courseService.restoreCourseById(req.params.id as string);
  res.status(200).json({ status: "success", message: "Course restored successfully" });
});

export const courseController = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  softDeleteCourseById,
  restoreCourseById,
  getCoursesByAuthor,
  createCourseCategory
};
