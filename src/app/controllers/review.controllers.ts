import { Request, Response } from "express"
import { catchAsyncHandler } from "../utils/catchAsyncHandler"
import { reviewSrvices } from "../services/review.service"

// =============================
// Create Review
// =============================
const createReview = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await reviewSrvices.createReview(req.body)

  res.json({
    success: true,
    message: "Review Created Successfully",
    data: result,
  })
})




// =============================
// 
// Get reviewby Id
// =============================
const getReviewByCourseId = catchAsyncHandler(async (req: Request, res: Response) => {
  const { courseId, userId } = req.query as { courseId?: string; userId?: string };

  if (!courseId || !userId) {
    return res.status(400).json({
      success: false,
      message: "courseId and userId are required",
    });
  }

  const result = await reviewSrvices.getReviewByCourseId(courseId, userId);

  res.json({
    success: true,
    message: "Get review successfully",
    data: result,
  });
});


export const reviewControllers = {
 
    createReview,
    getReviewByCourseId
}
