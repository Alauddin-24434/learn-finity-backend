// controllers/enrollment.controller.ts
import { Request, Response } from "express";
import { enrollmentService } from "../services/enrollment.service";
import { catchAsyncHandler } from "../utils/catchAsyncHandler";

// Enroll a user in a course
const enrollUser = catchAsyncHandler(async (req: Request, res: Response) => {
  const enrollment = await enrollmentService.createEnrollment(req.body);
  res.status(201).json({ success: true, data: enrollment });
}
)
// Get all enrollments of a user by userId
const getEnrollmentsByUserId = catchAsyncHandler(async (req: Request, res: Response) => {
  const { userId } = req.params;
  const enrollments = await enrollmentService.getEnrollmentsByUserId(userId);
  res.status(200).json({ success: true, data: enrollments });
} )

export const enrollmentController = {
  enrollUser,
  getEnrollmentsByUserId,
};
