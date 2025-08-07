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
exports.authenticate = void 0;
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const catchAsyncHandler_1 = require("../utils/catchAsyncHandler");
const config_1 = require("../config");
const prisma_1 = require("../lib/prisma");
exports.authenticate = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let token;
    const authHeader = req.headers.authorization;
    if (authHeader && authHeader.startsWith("Bearer ")) {
        token = authHeader.split(" ")[1];
    }
    if (!token) {
        return res.status(401).json({ message: "Unauthorized: Token missing" });
    }
    let decoded;
    try {
        decoded = jsonwebtoken_1.default.verify(token, config_1.envVariable.JWT_ACCESS_TOKEN_SECRET, {
            clockTolerance: 5,
        });
    }
    catch (error) {
        if (error instanceof jsonwebtoken_1.default.TokenExpiredError) {
            return res.status(401).json({ message: "Unauthorized: Token expired" });
        }
        else if (error instanceof jsonwebtoken_1.default.JsonWebTokenError) {
            return res.status(401).json({ message: "Unauthorized: Invalid token" });
        }
        throw error;
    }
    const user = yield prisma_1.prisma.user.findUnique({
        where: { id: decoded.id },
        select: { id: true, isAdmin: true },
    });
    if (!user) {
        return res.status(401).json({ message: "Unauthorized: User not found" });
    }
    req.user = user;
    next();
}));
