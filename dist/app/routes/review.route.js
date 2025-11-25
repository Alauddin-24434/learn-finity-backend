"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.reviewRoutes = void 0;
const express_1 = __importDefault(require("express"));
const review_controllers_1 = require("../controllers/review.controllers");
const router = express_1.default.Router();
// Create review
router.post("/", review_controllers_1.reviewControllers.createReview);
// Get review by courseId & userId (query params)
router.get("/", review_controllers_1.reviewControllers.getReviewByCourseId);
exports.reviewRoutes = router;
