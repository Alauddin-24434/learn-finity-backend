
// controllers/course.controller.ts
import { Request, Response } from "express";

import { catchAsyncHandler } from "../../utils/catchAsyncHandler";
import { courseService } from "./course.service";
import { IUser } from "../User/user.interfcae";

const createCourse = catchAsyncHandler(async (req: Request, res: Response) => {
  const thumbnailUrl = req.file?.path; // Cloudinary UR
  const bodyData = {
    ...req.body,
    thumbnail: thumbnailUrl
  }



  const course = await courseService.createCourse(bodyData);

  res.status(201).json({ status: "success", data: course });
});

const getCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.getCourseById(req.params.id);
  res.status(200).json({ status: "success", data: course });
});

const getAllCourses = catchAsyncHandler(async (req: Request, res: Response) => {
 
  const query= req.query;
  
  const courses = await courseService.getAllCourses(query);

  res.status(200).json({ status: "success", data: courses });
});
const getMyCourses = catchAsyncHandler(async (req: Request, res: Response) => {
  const id=req.user?.id;
  const query= req.query;
 
  const mixup={
    ...query,
   id
  }
  const courses = await courseService.getMyCourses(mixup);

  res.status(200).json({ status: "success", data: courses });
});

const updateCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  const course = await courseService.updateCourseById(req.params.id, req.body);

  res.status(200).json({ status: "success", data: course });
});

const deleteCourseById = catchAsyncHandler(async (req: Request, res: Response) => {
  await courseService.deleteCourseById(req.params.id);
  res.status(204).json({ status: "success", data: null });
});

export const courseController = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById,
  getMyCourses
};
