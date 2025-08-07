"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.couponSchema = void 0;
// validations/enrollment.validation.ts
const zod_1 = require("zod");
// validations/coupon.validation.ts
exports.couponSchema = zod_1.z.object({
    body: zod_1.z.object({
        code: zod_1.z.string().min(3),
        discount: zod_1.z.number().min(1).max(100),
        expiresAt: zod_1.z.string().datetime(),
        courseIds: zod_1.z.array(zod_1.z.string()).optional(),
    })
});
