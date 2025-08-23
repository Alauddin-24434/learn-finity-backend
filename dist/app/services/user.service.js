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
const prisma_1 = require("../lib/prisma");
const AppError_1 = require("../error/AppError");
/**
 * @desc Get all users (excluding password)
 * @returns Array of user objects
 */
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.user.findMany({
        where: { isDeleted: false }, // Ignore soft-deleted users
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
});
/**
 * @desc Update user by ID
 * @param id - User ID
 * @param data - Fields to update
 * @returns Updated user object (excluding password)
 * @throws AppError if user not found
 */
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user || user.isDeleted)
        throw new AppError_1.AppError(404, "User not found");
    return yield prisma_1.prisma.user.update({
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
});
/**
 * @desc Soft delete user by ID
 * @param id - User ID
 * @returns Success message
 * @throws AppError if user not found
 */
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user || user.isDeleted)
        throw new AppError_1.AppError(404, "User not found");
    yield prisma_1.prisma.user.update({ where: { id }, data: { isDeleted: true } });
    return { message: "User deleted successfully" };
});
exports.userService = {
    getAllUsers,
    updateUser,
    deleteUser,
};
