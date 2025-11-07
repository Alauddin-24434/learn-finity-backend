"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const zod_1 = require("zod");
const mongoose_1 = __importDefault(require("mongoose"));
const appError_1 = require("../errors/appError");
const authErrorHandler = (error, req, res, next) => {
    let status = 500;
    let name = "InternalServerError";
    let message = "Something went wrong!";
    const issue = [];
    // Zod validation errors
    if (error instanceof zod_1.ZodError) {
        status = 400;
        name = "ZodValidationError";
        message = "Validation failed";
        issue.push(...error.issues.map((err) => ({
            path: err.path.join("."),
            message: err.message,
        })));
    }
    // Mongoose duplicate key error (e.g., unique constraint)
    else if (error instanceof mongoose_1.default.Error && error.code === 11000) {
        status = 400;
        name = "MongoDuplicateKeyError";
        const keys = Object.keys(error.keyValue || {});
        message = `Duplicate value for field(s): ${keys.join(", ")}`;
        keys.forEach((key) => issue.push({ path: key, message }));
    }
    // Mongoose validation error
    else if (error instanceof mongoose_1.default.Error.ValidationError) {
        status = 400;
        name = "MongooseValidationError";
        message = "Validation failed";
        Object.values(error.errors).forEach((err) => {
            issue.push({ path: err.path, message: err.message });
        });
    }
    // Custom AppError
    else if (error instanceof appError_1.AppError) {
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
exports.default = authErrorHandler;
//# sourceMappingURL=authEroroHandeller.js.map