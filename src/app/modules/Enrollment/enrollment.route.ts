import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { enrollmentSchema } from "./enrollment.validation"
import { enrollmentController } from "./enrollment.controller"

const router = Router()
router.post("/",  validateRequest(enrollmentSchema), enrollmentController.enrollUser )


export const enrollmentRoutes = router
