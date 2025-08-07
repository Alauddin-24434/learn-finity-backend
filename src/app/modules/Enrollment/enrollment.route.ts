import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { enrollmentSchema } from "./enrollment.validation"
import { enrollUser } from "./enrollment.controller"

const router = Router()
router.post("/",  validateRequest(enrollmentSchema), enrollUser )


export const enrollmentRoutes = router
