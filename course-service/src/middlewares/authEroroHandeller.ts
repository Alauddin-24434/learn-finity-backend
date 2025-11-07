import type { Request, Response, NextFunction, ErrorRequestHandler } from "express";
import { ZodError } from "zod";

import { AppError } from "../errors/appError";
import { Prisma } from "../../generated/prisma";

const authErrorHandler: ErrorRequestHandler = (
  error: any,
  req: Request,
  res: Response,
  next: NextFunction
) => {
  let status = 500;
  let name = "InternalServerError";
  let message = "Something went wrong!";
  const issue: { path: string; message: string }[] = [];

  // 🟠 Zod Validation Error
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

  // 🟣 Prisma Known Request Error
  else if (error instanceof Prisma.PrismaClientKnownRequestError) {
    name = "PrismaClientKnownRequestError";

    switch (error.code) {
      case "P2002":
        status = 400;
        message = `Duplicate value for field(s): ${(error.meta?.target as string[]).join(", ")}`;
        issue.push({ path: (error.meta?.target as string[]).join(", "), message });
        break;

      case "P2003":
        status = 400;
        message = `Invalid foreign key reference — the related record does not exist.`;
        issue.push({ path: "foreign_key", message });
        break;

      default:
        status = 400;
        message = error.message.replace(/\n/g, " "); // clean multiline Prisma message
        issue.push({ path: "general", message });
        break;
    }
  }

  // 🟢 Prisma Validation Error
  else if (error instanceof Prisma.PrismaClientValidationError) {
    status = 400;
    name = "PrismaClientValidationError";
    message = "Invalid data provided to Prisma";
    issue.push({ path: "general", message });
  }

  // 🔵 Custom App Error
  else if (error instanceof AppError) {
    status = error.statusCode || 500;
    name = error.name || "AppError";
    message = error.message;
    issue.push({ path: "general", message });
  }

  // ⚪ JavaScript Error
  else if (error instanceof Error) {
    name = error.name;
    message = error.message;
    issue.push({ path: "general", message });
  }

  // 🟤 Unknown Error
  else {
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
    stack: process.env.NODE_ENV === "development" ? error.stack : undefined,
  });
};

export default authErrorHandler;
