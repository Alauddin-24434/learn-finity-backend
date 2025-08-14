"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.userService = void 0;
const prisma_1 = require("../../lib/prisma");
// =============================
// Get all users (excluding password)
// =============================
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const users = yield prisma_1.prisma.user.findMany({
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return users;
});
// =============================
// Get current user by ID (Get Me)
// Includes enrolled courses but excludes password
// =============================
const getMe = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id },
        select: {
            id: true,
            name: true,
            email: true,
            avatar: true,
            courseEnrollments: { select: { courseId: true } },
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    // Exclude courseEnrollments and password
    return user;
});
// =============================
// Update user by ID
// Returns updated user (excluding password)
// =============================
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new Error("User not found");
    }
    const updatedUser = yield prisma_1.prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            name: true,
            email: true,
            phone: true,
            avatar: true,
            isAdmin: true,
            createdAt: true,
            updatedAt: true,
        },
    });
    return updatedUser;
});
// =============================
// Soft delete user by ID
// Marks user as deleted instead of removing from DB
// =============================
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new Error("User not found");
    }
    yield prisma_1.prisma.user.update({ where: { id }, data: { isDeleted: true } });
    return { message: "User deleted successfully" };
});
// ✅ Exported service object
exports.userService = {
    getAllUsers,
    updateUser,
    deleteUser,
    getMe,
};
