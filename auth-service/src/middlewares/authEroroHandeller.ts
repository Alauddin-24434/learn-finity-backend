import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";
import mongoose from "mongoose";
import { AppError } from "../errors/appError";

const authErrorHandler: ErrorRequestHandler = (error:any, req: Request, res: Response, next: NextFunction) => {

  let status = 500;
  let name = "InternalServerError";
  let message = "Something went wrong!";
  const issue: { path: string; message: string }[] = [];

  // Zod validation errors
  if (error instanceof ZodError) {
    status = 400;
    name = "ZodValidationError";
    message = "Validation failed";
    issue.push(
      ...error.issues.map((err) => ({
        path: err.path.join("."),
        message: err.message,
      }))
    );
  }
  // Mongoose duplicate key error (e.g., unique constraint)
  else if (error instanceof mongoose.Error && (error as any).code === 11000) {
    status = 400;
    name = "MongoDuplicateKeyError";
    const keys = Object.keys((error as any).keyValue || {});
    message = `Duplicate value for field(s): ${keys.join(", ")}`;
    keys.forEach((key) => issue.push({ path: key, message }));
  }
  // Mongoose validation error
  else if (error instanceof mongoose.Error.ValidationError) {
    status = 400;
    name = "MongooseValidationError";
    message = "Validation failed";
    Object.values(error.errors).forEach((err: any) => {
      issue.push({ path: err.path, message: err.message });
    });
  }
  // Custom AppError
  else if (error instanceof AppError) {
    status = error.statusCode || 500;
    name = error.name || "AppError";
    message = error.message;
    issue.push({ path: "general", message });
  }
  // Standard JS Error
  else if (error instanceof Error) {
    status = 500;
    name = error.name;
    message = error.message;
    issue.push({ path: "general", message });
  }
  // Fallback unknown error
  else {
    status = 500;
    name = "UnknownError";
    message = "An unknown error occurred.";
    issue.push({ path: "general", message });
  }

  return res.status(status).json({
    success: false,
    name,
    message,
    issue,
    status,
    stack: error.stack
  });
};

export default authErrorHandler;
