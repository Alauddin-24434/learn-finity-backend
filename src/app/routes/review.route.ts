import express from "express";
import { reviewControllers } from "../controllers/review.controllers";

const router = express.Router();

// Create review
router.post("/", reviewControllers.createReview);

// Get review by courseId & userId (query params)
router.get("/", reviewControllers.getReviewByCourseId);

export const reviewRoutes = router;
