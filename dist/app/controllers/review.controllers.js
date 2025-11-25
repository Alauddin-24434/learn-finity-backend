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
exports.reviewControllers = void 0;
const catchAsyncHandler_1 = require("../utils/catchAsyncHandler");
const review_service_1 = require("../services/review.service");
// =============================
// Create Review
// =============================
const createReview = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const result = yield review_service_1.reviewSrvices.createReview(req.body);
    res.json({
        success: true,
        message: "Review Created Successfully",
        data: result,
    });
}));
// =============================
// 
// Get reviewby Id
// =============================
const getReviewByCourseId = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { courseId, userId } = req.query;
    if (!courseId || !userId) {
        return res.status(400).json({
            success: false,
            message: "courseId and userId are required",
        });
    }
    const result = yield review_service_1.reviewSrvices.getReviewByCourseId(courseId, userId);
    res.json({
        success: true,
        message: "Get review successfully",
        data: result,
    });
}));
exports.reviewControllers = {
    createReview,
    getReviewByCourseId
};
