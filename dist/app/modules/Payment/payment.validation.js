"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentSchema = exports.paymentStatusEnum = void 0;
const zod_1 = require("zod");
// Enum for payment status
exports.paymentStatusEnum = zod_1.z.enum(["PENDING", "PAID", "FAILED", "CANCELLED"]);
// Payment input validation
exports.paymentSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1, "User ID is required"),
        courseId: zod_1.z.string().min(1, "Course ID is required"),
        phone: zod_1.z.string("Pnpne number is required"),
        amount: zod_1.z.number().int().positive("Amount must be a positive integer"),
        currency: zod_1.z.string().min(1, "Currency is required"), // You can use enum here if it's fixed
        status: exports.paymentStatusEnum.default("PENDING"),
        provider: zod_1.z.string().min(1, "Provider is required"), // Consider enum if limited values
        transactionId: zod_1.z.string().optional(),
        paidAt: zod_1.z.date().optional(),
    })
});
