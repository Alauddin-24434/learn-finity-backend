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
  const { courseId } = req.query as { courseId?: string};

  if (!courseId) {
    return res.status(400).json({
      success: false,
      message: "courseId and userId are required",
    });
  }

  const result = await reviewSrvices.getReviewByCourseId(courseId);

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
