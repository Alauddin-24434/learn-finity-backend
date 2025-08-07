// controllers/coupon.controller.ts
import { Request, Response } from "express";
import { createCoupon } from "./coupon.service";

export const addCoupon = async (req: Request, res: Response) => {
  const coupon = await createCoupon(req.body);
  res.status(201).json({ success: true, data: coupon });
};
