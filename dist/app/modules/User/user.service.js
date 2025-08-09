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
const getAllUsers = () => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield prisma_1.prisma.user.findMany();
    return user;
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
