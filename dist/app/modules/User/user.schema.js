"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.loginSchema = exports.updateUserSchema = void 0;
const zod_1 = require("zod");
exports.updateUserSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email address").optional(),
    name: zod_1.z.string().min(3, "Name should be at least 3 characters").optional(),
    password: zod_1.z.string().min(6, "Password should be at least 6 characters").optional(),
    avatar: zod_1.z.string().url().optional(),
    role: zod_1.z.enum(["ADMIN", "SUPER_ADMIN", "STUDENT", "STAFF", "GUEST"]).optional(),
});
exports.loginSchema = zod_1.z.object({
    email: zod_1.z.string().email("Invalid email"),
    password: zod_1.z.string().min(6, "Password too short"),
});
