import { AppError } from "../error/AppError";
import { IReview } from "../interfaces/review.interface";
import { prisma } from "../lib/prisma";

const createReview = async (payload: IReview) => {
  const create = await prisma.review.create({
    data: {
      courseId: payload.courseId,
      userId: payload.userId,
      ratings: payload.ratings,
      comment: payload.comment,
      isDeleted: false,
    },
  });

  return create;
};

const getReviewByCourseId = async (courseId: string) => {
  const result = await prisma.review.findMany({
    where: { courseId },
    include: {
      user: {
        // <-- user extract
        select: {
          id: true,
          name: true,
          email: true,
          avatar: true,
        },
      },
    },
  });
  if (!result) {
    throw new AppError(404, "Review Not Found");
  }

  return result;
};

export const reviewSrvices = {
  createReview,
  getReviewByCourseId,
};
