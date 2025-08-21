// routes/payment.routes.ts
import express from "express";
import { validateRequest } from "../../middleware/validateRequest";
import { paymentController } from "./payment.controller";
import { paymentSchema } from "./payment.validation";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Payments
 *   description: APIs to handle course payments
 */

/**
 * @swagger
 * /api/payments/initiate:
 *   post:
 *     summary: Initiate a payment
 *     tags: [Payments]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             $ref: '#/components/schemas/PaymentInitiate'
 *     responses:
 *       200:
 *         description: Payment initiated successfully
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Payment initiated
 *               data:
 *                 paymentId: "pay_12345"
 */
router.post("/initiate", validateRequest(paymentSchema), paymentController.initiatePayment);

/**
 * @swagger
 * /api/payments/success:
 *   post:
 *     summary: Handle successful payment
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment successful
 *         content:
 *           application/json:
 *             example:
 *               status: success
 *               message: Payment completed successfully
 *               data:
 *                 paymentId: "pay_12345"
 */
router.post("/success", paymentController.paymentSuccess);

/**
 * @swagger
 * /api/payments/fail:
 *   post:
 *     summary: Handle failed payment
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment failed
 *         content:
 *           application/json:
 *             example:
 *               status: fail
 *               message: Payment failed
 */
router.post("/fail", paymentController.paymentFail);

/**
 * @swagger
 * /api/payments/cancel:
 *   get:
 *     summary: Handle canceled payment
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: Payment canceled
 *         content:
 *           application/json:
 *             example:
 *               status: canceled
 *               message: Payment canceled by user
 */
router.get("/cancel", paymentController.paymentCancel);

/**
 * @swagger
 * /api/payments:
 *   get:
 *     summary: Get all payments
 *     tags: [Payments]
 *     responses:
 *       200:
 *         description: List of all payments
 */
router.get("/", paymentController.getAllPayments);

export const paymentRoutes = router;
