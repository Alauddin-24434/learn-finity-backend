"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponUsageSchema = void 0;
const zod_1 = require("zod");
// validations/couponUsage.validation.ts
exports.couponUsageSchema = zod_1.z.object({
    body: zod_1.z.object({
        userId: zod_1.z.string().min(1),
        couponId: zod_1.z.string().min(1),
    })
});
