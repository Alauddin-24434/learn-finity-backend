import { Request, Response } from "express"
import { catchAsyncHandler } from "../../utils/catchAsyncHandler"
import { createLessonIntoDB, deleteLessonFromDB, getAllLessonsFromDB, getSingleLessonFromDB } from "./lession.service"
import { sendResponse } from "../../utils/sendResponse"

export const createLesson = catchAsyncHandler(async (req: Request, res: Response) => {
  const lesson = await createLessonIntoDB(req.body)
  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Lesson created successfully",
    data: lesson,
  })
})

export const getAllLessons = catchAsyncHandler(async (_req: Request, res: Response) => {
  const lessons = await getAllLessonsFromDB()
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lessons retrieved successfully",
    data: lessons,
  })
})

export const getSingleLesson = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const lesson = await getSingleLessonFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson retrieved successfully",
    data: lesson,
  })
})

export const deleteLesson = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const result = await deleteLessonFromDB(id)
  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Lesson deleted successfully",
    data: result,
  })
})
