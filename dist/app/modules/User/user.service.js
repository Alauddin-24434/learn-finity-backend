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
            courseEnrollments: {
                select: {
                    course: {
                        select: {
                            id: true,
                            title: true,
                            price: true,
                            isFree: true,
                            thumbnail: true,
                            author: {
                                select: {
                                    name: true,
                                },
                            },
                            lessons: {
                                select: {
                                    id: true,
                                    lessonProgress: {
                                        where: { userId: id }, // current user progress
                                        select: {
                                            completed: true,
                                        },
                                    },
                                },
                            },
                        },
                    },
                },
            },
        },
    });
    if (!user) {
        throw new Error("User not found");
    }
    const formattedUser = {
        id: user.id,
        name: user.name,
        email: user.email,
        avatar: user.avatar,
        enrollments: user.courseEnrollments.map((e) => {
            const course = e.course;
            const totalLessons = course.lessons.length;
            const completedLessons = course.lessons.filter((l) => l.lessonProgress.length > 0 && l.lessonProgress[0].completed).length;
            const progressPercentage = totalLessons === 0 ? 0 : Math.round((completedLessons / totalLessons) * 100);
            return {
                id: course.id,
                title: course.title,
                price: course.price,
                isFree: course.isFree,
                thumbnail: course.thumbnail,
                author: course.author,
                totalLessons,
                completedLessons,
                progressPercentage,
            };
        }),
    };
    return formattedUser;
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
