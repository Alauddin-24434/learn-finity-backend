"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const AppError_1 = require("../error/AppError");
const library_1 = require("../../../generated/prisma/runtime/library");
// ====================
// Global Error Handler Middleware
// ====================
const globalErrorHandler = (error, req, res, next) => {
    var _a, _b;
    // Default error response values
    let status = 500;
    let name = "InternalServerError";
    let message = "Something went wrong!";
    const issue = [];
    // --------------------
    // Handle Zod validation errors
    // --------------------
    if (error instanceof zod_1.ZodError) {
        console.log("err", error);
        status = 400;
        name = "ZodValidationError";
        message = "Validation failed";
        const issues = error.issues;
        const extractedSimple = issues.map((err) => ({
            path: err.path[1],
            message: err.message,
        }));
        issue.push(...extractedSimple);
    }
    // --------------------
    // Handle known Prisma client errors with specific codes
    // --------------------
    else if (error instanceof library_1.PrismaClientKnownRequestError) {
        console.log("p", error);
        status = 400;
        name = "PrismaClientKnownRequestError";
        switch (error.code) {
            case "P2002":
                message = `Unique constraint failed on the field(s): ${((_a = error.meta) === null || _a === void 0 ? void 0 : _a.target) || "unknown"}.`;
                issue.push({
                    path: String(((_b = error.meta) === null || _b === void 0 ? void 0 : _b.target) || "unknown"),
                    message,
                });
                break;
            case "P2025":
                message = "Record not found.";
                issue.push({ path: "record", message });
                break;
            default:
                message = error.message;
                issue.push({ path: "prisma", message });
                break;
        }
    }
    // --------------------
    // Handle Prisma validation errors
    // --------------------
    else if (error instanceof library_1.PrismaClientValidationError) {
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
        }
        else {
            issue.push({
                path: "general",
                message: "Invalid input provided to the database.",
            });
        }
    }
    // --------------------
    // Handle other Prisma client errors
    // --------------------
    else if (error instanceof library_1.PrismaClientInitializationError) {
        status = 500;
        name = "PrismaClientInitializationError";
        message = "Failed to initialize database connection";
        issue.push({ path: "prisma", message });
    }
    else if (error instanceof library_1.PrismaClientUnknownRequestError) {
        status = 500;
        name = "PrismaClientUnknownRequestError";
        message = "Unknown database error";
        issue.push({ path: "prisma", message });
    }
    else if (error instanceof library_1.PrismaClientRustPanicError) {
        status = 500;
        name = "PrismaClientRustPanicError";
        message = "Prisma engine crashed unexpectedly.";
        issue.push({ path: "prisma", message });
    }
    // --------------------
    // Handle custom application errors
    // --------------------
    else if (error instanceof AppError_1.AppError) {
        status = error.statusCode || 500;
        name = error.name || "AppError";
        message = error.message;
        issue.push({ path: "general", message });
    }
    // --------------------
    // Handle all other standard JS errors
    // --------------------
    else if (error instanceof Error) {
        name = error.name;
        message = error.message;
        issue.push({ path: "general", message });
    }
    // --------------------
    // Fallback for unknown errors
    // --------------------
    else {
        issue.push({ path: "general", message });
    }
    const errorResponse = {
        success: false,
        name,
        message,
        issue,
        status,
        // stack: process.env.NODE_ENV !== "production" ? error.stack : undefined,
        stack: error.stack
    };
    return res.status(status).json(errorResponse);
};
exports.default = globalErrorHandler;
