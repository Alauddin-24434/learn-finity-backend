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
exports.reviewSrvices = void 0;
const AppError_1 = require("../error/AppError");
const prisma_1 = require("../lib/prisma");
const createReview = (payload) => __awaiter(void 0, void 0, void 0, function* () {
    const create = yield prisma_1.prisma.review.create({
        data: {
            courseId: payload.courseId,
            userId: payload.userId,
            ratings: payload.ratings,
            comment: payload.comment,
            isDeleted: false,
        },
    });
    return create;
});
const getReviewByCourseId = (courseId, userId) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield prisma_1.prisma.review.findFirst({
        where: { courseId, userId }
    });
    if (!result) {
        throw new AppError_1.AppError(404, "Review Not Found");
    }
    return result;
});
exports.reviewSrvices = {
    createReview,
    getReviewByCourseId
};
