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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const prisma_1 = require("../app/lib/prisma");
const auth_service_1 = require("../app/modules/Auth/auth.service");
jest.mock("../app/lib/prisma", () => ({
    prisma: { user: { findUnique: jest.fn(), create: jest.fn() } },
}));
jest.mock("bcryptjs");
describe("Auth Service", () => {
    const userData = { name: "Test", email: "test@example.com", password: "123456", phone: "0123", avatar: "img.jpg" };
    const hashedPassword = "hashed123";
    beforeEach(() => jest.clearAllMocks());
    it("registerUser should create new user", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        bcryptjs_1.default.hash.mockResolvedValue(hashedPassword);
        prisma_1.prisma.user.create.mockResolvedValue(Object.assign(Object.assign({}, userData), { id: "1", password: hashedPassword }));
        const result = yield auth_service_1.AuthService.registerUser(userData);
        expect(prisma_1.prisma.user.create).toHaveBeenCalled();
        expect(result.email).toBe(userData.email);
    }));
    it("loginUser should throw error for invalid email", () => __awaiter(void 0, void 0, void 0, function* () {
        prisma_1.prisma.user.findUnique.mockResolvedValue(null);
        yield expect(auth_service_1.AuthService.loginUser({ email: "test@example.com", password: hashedPassword })).rejects.toThrow("Invalid email or password");
    }));
});
