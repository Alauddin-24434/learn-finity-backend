"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
// routes/payment.routes.ts
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../middleware/validateRequest");
const payment_controller_1 = require("../controllers/payment.controller");
const payment_validation_1 = require("../validations/payment.validation");
const router = express_1.default.Router();
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
router.post("/initiate", (0, validateRequest_1.validateRequest)(payment_validation_1.paymentSchema), payment_controller_1.paymentController.initiatePayment);
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
router.post("/success", payment_controller_1.paymentController.paymentSuccess);
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
router.post("/fail", payment_controller_1.paymentController.paymentFail);
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
router.get("/cancel", payment_controller_1.paymentController.paymentCancel);
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
router.get("/", payment_controller_1.paymentController.getAllPayments);
exports.paymentRoutes = router;
