import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { couponSchema } from "./coupon.validation"
import { addCoupon } from "./coupon.controller"
const router = Router()
router.post("/",  validateRequest(couponSchema),addCoupon )


export const couponRoutes = router
