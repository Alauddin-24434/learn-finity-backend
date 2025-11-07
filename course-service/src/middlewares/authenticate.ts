import type { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { catchAsyncHandler } from "../utils/catchAsync";
import { envVariable } from "../config";

interface JwtDecodedPayload {
  id: string;
  role: string[];
  iat?: number;
  exp?: number;
}

declare global {
  namespace Express {
    interface Request {
      user?: {
        id: string;
        role: string[];
      };
    }
  }
}

export const authenticate = catchAsyncHandler(async (req: Request, res: Response, next: NextFunction) => {
  const token = req.headers.authorization?.split(" ")[1] || req.cookies?.accessToken;
  if (!token) return res.status(401).json({ message: "Token missing" });

  try {
    const decoded = jwt.verify(token, envVariable.JWT_ACCESS_TOKEN_SECRET) as JwtDecodedPayload;
    req.user = { id: decoded.id, role: decoded.role };
    next();
  } catch (err) {
    return res.status(401).json({ message: "Invalid or expired token" });
  }
}
);
