// controllers/enrollment.controller.ts
import { Request, Response } from "express";
import { enrollmetService } from "./enrollment.service";

 const enrollUser = async (req: Request, res: Response) => {
  const enrollment = await enrollmetService.createEnrollment(req.body);
  res.status(201).json({ success: true, data: enrollment });
};


export const enrollmentController={
  enrollUser
}