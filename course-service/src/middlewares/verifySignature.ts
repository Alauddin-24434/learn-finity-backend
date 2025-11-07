import { Request, Response, NextFunction } from "express";
import crypto from "crypto";
import dotenv from "dotenv";
dotenv.config();
export const verifyCloudinarySignature = (req: Request, res: Response, next: NextFunction) => {
  const { signature, timestamp, folder } = req.body;

  if (!signature || !timestamp) {
    return res.status(400).json({ message: "Missing signature" });
  }

  // Generate server-side signature
  const payload = `folder=${folder}&timestamp=${timestamp}${process.env.CLOUDINARY_API_SECRET}`;
  const hash = crypto.createHash("sha1").update(payload).digest("hex");

  if (hash !== signature) {
    return res.status(403).json({ message: "Invalid signature" });
  }

  // Optional: timestamp expiry check (e.g., 5 min)
  const now = Math.floor(Date.now() / 1000);
  if (Math.abs(now - timestamp) > 300) {
    return res.status(403).json({ message: "Signature expired" });
  }

  next();
};
