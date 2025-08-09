"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.paymentController = void 0;
const catchAsyncHandler_1 = require("../../utils/catchAsyncHandler");
const payment_service_1 = require("./payment.service");
const generatePaymnetTemplate_1 = require("../../paymentIntegration/generatePaymnetTemplate");
//==================== Initiate Payment =========================//
// This endpoint initiates a new payment and stores it in the database.
const generateTransactionId = () => {
    const now = new Date();
    const datePart = `${now.getMonth() + 1}${now.getDate()}`.padStart(4, "0"); // "0729"
    const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase(); // "XYZ12"
    return `TRX-${datePart}-${randomPart}`;
};
const initiatePayment = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const transactionId = generateTransactionId();
    const bodyData = Object.assign(Object.assign({}, req.body), { transactionId });
    const paymentInitiateResult = yield payment_service_1.paymentService.initiatePaymentInDb(bodyData);
    const { payment_url } = paymentInitiateResult;
    res.status(201).json({ success: true, url: payment_url });
}));
//==================== Payment Success Callback =========================//
// This endpoint is called by the payment gateway when the payment is successful.
// It updates the payment status in the database and shows a success page.
const paymentSuccess = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    yield payment_service_1.paymentService.paymentSuccessInDb(transactionId);
    res.send((0, generatePaymnetTemplate_1.generatePaymentHtml)("success"));
}));
//==================== Payment Failure Callback =========================//
// This endpoint is called by the payment gateway when the payment fails.
// It updates the payment status in the database and shows a failure page.
const paymentFail = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    yield payment_service_1.paymentService.paymentFailInDb(transactionId);
    res.send((0, generatePaymnetTemplate_1.generatePaymentHtml)("failed"));
}));
//==================== Payment Cancellation Callback =========================//
// This endpoint is called by the payment gateway when the user cancels the payment.
// It updates the payment status in the database and shows a cancellation page.
const paymentCancel = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const { transactionId } = req.query;
    yield payment_service_1.paymentService.paymentCancelDb(transactionId);
    res.send((0, generatePaymnetTemplate_1.generatePaymentHtml)("cancelled"));
}));
//==================== Get Single Payment =========================//
// // This endpoint retrieves a single payment by its ID.
// const getPayment = catchAsyncHandler(async (req: Request, res: Response) => {
//   const payment = await paymentService.(req.params.id);
//   res.status(200).json({ success: true, data: payment });
// });
//==================== Get All Payments =========================//
// This endpoint retrieves all payment records from the database.
const getAllPayments = (0, catchAsyncHandler_1.catchAsyncHandler)((req, res) => __awaiter(void 0, void 0, void 0, function* () {
    const payments = yield payment_service_1.paymentService.getAllPayments();
    res.status(200).json({ success: true, data: payments });
}));
exports.paymentController = {
    initiatePayment,
    paymentCancel,
    paymentFail,
    paymentSuccess,
    getAllPayments
};
