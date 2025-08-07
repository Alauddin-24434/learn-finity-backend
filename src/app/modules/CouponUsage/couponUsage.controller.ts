// controllers/couponUsage.controller.ts
import { Request, Response } from "express";
import { createCouponUsage } from "./couponUsage.service";

export const useCoupon = async (req: Request, res: Response) => {
  const usage = await createCouponUsage(req.body);
  res.status(201).json({ success: true, data: usage });
};
