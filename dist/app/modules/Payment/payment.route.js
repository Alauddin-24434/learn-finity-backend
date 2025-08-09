"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentRoutes = void 0;
const express_1 = __importDefault(require("express"));
const validateRequest_1 = require("../../middleware/validateRequest");
const payment_controller_1 = require("./payment.controller");
const payment_validation_1 = require("./payment.validation");
const router = express_1.default.Router();
// Payment routes
router.post('/initiate', (0, validateRequest_1.validateRequest)(payment_validation_1.paymentSchema), payment_controller_1.paymentController.initiatePayment);
router.post('/success', payment_controller_1.paymentController.paymentSuccess);
router.post('/fail', payment_controller_1.paymentController.paymentFail);
router.get('/cancel', payment_controller_1.paymentController.paymentCancel);
router.get('/', payment_controller_1.paymentController.getAllPayments);
exports.paymentRoutes = router;
