import express from "express"
import { validateRequest } from "../../middleware/validateRequest"

import { paymentController } from "./payment.controller"
import { paymentSchema } from "./payment.validation";

const router = express.Router()

// Payment routes

router.post('/initiate', validateRequest(paymentSchema), paymentController.initiatePayment);
router.post('/success', paymentController.paymentSuccess)
router.post('/fail', paymentController.paymentFail)
router.get('/cancel', paymentController.paymentCancel)
router.get('/', paymentController.getAllPayments)


export const paymentRoutes = router
