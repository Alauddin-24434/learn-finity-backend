import type { Request, Response, NextFunction, ErrorRequestHandler } from "express"
import {
  PrismaClientInitializationError,
  PrismaClientKnownRequestError,
  PrismaClientRustPanicError,
  PrismaClientUnknownRequestError,
  PrismaClientValidationError,
} from "@prisma/client/runtime/library"
import { ZodError } from "zod"
import { AppError } from "../error/AppError"

// ====================
// Global Error Handler Middleware
// ====================
const globalErrorHandler: ErrorRequestHandler = (error: Error, req: Request, res: Response, next: NextFunction) => {
  // Default error response values
  let status = 500
  let name = "InternalServerError"
  let message = "Something went wrong!"
  const issue: { path: string; message: string }[] = []

  // --------------------
  // Handle Zod validation errors
  // --------------------
  if (error instanceof ZodError) {

    console.log("err", error)
    status = 400
    name = "ZodValidationError"
    message = "Validation failed"
    const issues = error.issues
    const extractedSimple = issues.map((err) => ({
      path: err.path[1],
      message: err.message,
    }))
    issue.push(...(extractedSimple as any))
  }
  // --------------------
  // Handle known Prisma client errors with specific codes
  // --------------------
  else if (error instanceof PrismaClientKnownRequestError) {

    console.log("p", error)
    status = 400
    name = "PrismaClientKnownRequestError"
    switch (error.code) {
      case "P2002":
        message = `Unique constraint failed on the field(s): ${error.meta?.target || "unknown"}.`
        issue.push({
          path: String(error.meta?.target || "unknown"),
          message,
        })
        break
      case "P2025":
        message = "Record not found."
        issue.push({ path: "record", message })
        break
      default:
        message = error.message
        issue.push({ path: "prisma", message })
        break
    }
  }
  // --------------------
  // Handle Prisma validation errors
  // --------------------
else if (error instanceof PrismaClientValidationError) {
  status = 400;
  name = "PrismaClientValidationError";
  message = "Validation error on database input";

  const regex = /Argument `(\w+)` is missing/;
  const match = regex.exec(error.message);

  if (match) {
    issue.push({
      path: match[1],
      message: `Missing required field '${match[1]}'`,
    });
  } else {
    issue.push({
      path: "general",
      message: "Invalid input provided to the database.",
    });
  }
}

  // --------------------
  // Handle other Prisma client errors
  // --------------------
  else if (error instanceof PrismaClientInitializationError) {
    status = 500
    name = "PrismaClientInitializationError"
    message = "Failed to initialize database connection"
    issue.push({ path: "prisma", message })
  } else if (error instanceof PrismaClientUnknownRequestError) {
    status = 500
    name = "PrismaClientUnknownRequestError"
    message = "Unknown database error"
    issue.push({ path: "prisma", message })
  } else if (error instanceof PrismaClientRustPanicError) {
    status = 500
    name = "PrismaClientRustPanicError"
    message = "Prisma engine crashed unexpectedly."
    issue.push({ path: "prisma", message })
  }
  // --------------------
  // Handle custom application errors
  // --------------------
  else if (error instanceof AppError) {
    status = error.statusCode || 500
    name = error.name || "AppError"
    message = error.message
    issue.push({ path: "general", message })
  }
  // --------------------
  // Handle all other standard JS errors
  // --------------------
  else if (error instanceof Error) {
    name = error.name
    message = error.message
    issue.push({ path: "general", message })
  }
  // --------------------
  // Fallback for unknown errors
  // --------------------
  else {
    issue.push({ path: "general", message })
  }

  const errorResponse = {
    success: false,
    name,
    message,
    issue,
    status,
    // stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
    stack: error.stack 
  }

  return res.status(status).json(errorResponse)
}

export default globalErrorHandler
