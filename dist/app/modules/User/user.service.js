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
// 2. Get All Users
const getAllUsers = (query, isAdmin) => __awaiter(void 0, void 0, void 0, function* () {
    const page = Number.parseInt(query.page || "1");
    const limit = Number.parseInt(query.limit || "10");
    const skip = (page - 1) * limit;
    // Search Filter
    const searchFilter = query.search
        ? {
            OR: [
                { name: { contains: query.search, mode: "insensitive" } },
                { email: { contains: query.search, mode: "insensitive" } },
            ],
        }
        : {};
    // Role Filter Logic
    let roleFilter = {};
    if (isAdmin) {
        roleFilter = {
            role: {
                in: ["GUEST", "STUDENT"],
            },
        };
    }
    else if (!isAdmin) {
        // যদি SUPER_ADMIN না হয় এবং ADMIN না হয়, ফাঁকা রিটার্ন দাও
        return {
            data: [],
            pagination: {
                page,
                limit,
                total: 0,
                totalPages: 0,
                hasNext: false,
                hasPrev: false,
            },
        };
    }
    const where = Object.assign(Object.assign({}, searchFilter), roleFilter);
    // Query Run
    const [users, total] = yield Promise.all([
        prisma_1.prisma.user.findMany({
            where,
            skip,
            take: limit,
            orderBy: { createdAt: "desc" },
        }),
        prisma_1.prisma.user.count({ where }),
    ]);
    return {
        data: users,
        pagination: {
            page,
            limit,
            total,
            totalPages: Math.ceil(total / limit),
            hasNext: page < Math.ceil(total / limit),
            hasPrev: page > 1,
        },
    };
});
// 3. Get User By ID
const getUserById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id },
    });
    if (!user) {
        throw new Error("User not found");
    }
    return user;
});
// 4. Update User
const updateUser = (id, data) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new Error("User not found");
    }
    return yield prisma_1.prisma.user.update({
        where: { id },
        data,
        select: {
            id: true,
            isAdmin: true,
            email: true,
            updatedAt: true,
        },
    });
});
// 5. Delete User
const deleteUser = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findUnique({ where: { id } });
    if (!user) {
        throw new Error("User not found");
    }
    yield prisma_1.prisma.user.delete({ where: { id } });
    return { message: "User deleted successfully" };
});
// ✅ Final Export Object
exports.userService = {
    getAllUsers,
    getUserById,
    updateUser,
    deleteUser,
};
