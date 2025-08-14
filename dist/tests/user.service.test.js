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
const prisma_1 = require("../app/lib/prisma");
const user_service_1 = require("../app/modules/User/user.service");
jest.mock("../app/lib/prisma", () => ({
    prisma: {
        user: {
            findMany: jest.fn(),
            findUnique: jest.fn(),
            update: jest.fn(),
        },
    },
}));
describe("User Service", () => {
    const user = { id: "1", name: "Test", email: "test@example.com", phone: "123", avatar: "img.jpg", isAdmin: false, createdAt: new Date(), updatedAt: new Date() };
    beforeEach(() => {
        jest.clearAllMocks();
    });
    it("getAllUsers should return users", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.user.findMany.mockResolvedValue([user]);
        const result = yield user_service_1.userService.getAllUsers();
        expect(result).toEqual([user]);
    }));
    it("getMe should return a user if found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.user.findUnique.mockResolvedValue(user);
        const result = yield user_service_1.userService.getMe("1");
        expect(result).toEqual(user);
    }));
    it("updateUser should throw error if user not found", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        yield expect(user_service_1.userService.updateUser("1", { name: "New" })).rejects.toThrow("User not found");
    }));
    it("deleteUser should return success message", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.user.findUnique.mockResolvedValue(user);
        prisma_1.prisma.user.update.mockResolvedValue(Object.assign(Object.assign({}, user), { isDeleted: true }));
        const result = yield user_service_1.userService.deleteUser("1");
        expect(result).toEqual({ message: "User deleted successfully" });
    }));
});
