import { Router } from "express"
import { validateRequest } from "../../middleware/validateRequest"
import { couponUsageSchema } from "./couponUsage.validation"
import { useCoupon } from "./couponUsage.controller"

const router = Router()
router.post("/",  validateRequest(couponUsageSchema),useCoupon )


export const useCouponRoutes = router
