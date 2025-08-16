import express from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { createLessonZodSchema } from "./lession.validation"
import { createLesson, deleteLesson, getAllLessons,lessonController } from "./lession.controller"
import { upload } from "../../lib/cloudinary"
import { authenticate } from "../../middleware/authenticate"

const router = express.Router()

router.post("/", upload.fields([{name:"video", maxCount:1}]), validateRequest(createLessonZodSchema), createLesson)
router.get("/", getAllLessons)
router.get("/:id",authenticate, lessonController.getLessonByCourseId)
router.delete("/:id", deleteLesson)
router.patch('/progress' ,authenticate, lessonController.updateLessonProgress)

export const lessonRoutes = router
