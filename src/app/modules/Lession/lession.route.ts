import express from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { createLessonZodSchema } from "./lession.validation"
import { createLesson, deleteLesson, getAllLessons, getSingleLesson } from "./lession.controller"
import { upload } from "../../lib/cloudinary"

const router = express.Router()

router.post("/", upload.fields([{name:"video", maxCount:1}]), validateRequest(createLessonZodSchema), createLesson)
router.get("/", getAllLessons)
router.get("/:id", getSingleLesson)
router.delete("/:id", deleteLesson)

export const lessonRoutes = router
