// controllers/enrollment.controller.ts
import { Request, Response } from "express";
import { createEnrollment } from "./enrollment.service";

export const enrollUser = async (req: Request, res: Response) => {
  const enrollment = await createEnrollment(req.body);
  res.status(201).json({ success: true, data: enrollment });
};
