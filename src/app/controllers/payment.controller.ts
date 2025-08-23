import type { Request, Response } from "express"
import { catchAsyncHandler } from "../utils/catchAsyncHandler"
import { sendResponse } from "../utils/sendResponse"
import { paymentService } from "../services/payment.service"
import { generatePaymentHtml } from "../utils/generatePaymnetTemplate";


//==================== Initiate Payment =========================//
// This endpoint initiates a new payment and stores it in the database.

const generateTransactionId = () => {
  const now = new Date();
  const datePart = `${now.getMonth() + 1}${now.getDate()}`.padStart(4, "0"); // "0729"
  const randomPart = Math.random().toString(36).substring(2, 7).toUpperCase(); // "XYZ12"
  return `TRX-${datePart}-${randomPart}`;
};

const initiatePayment = catchAsyncHandler(async (req: Request, res: Response) => {
  const transactionId = generateTransactionId();

  const bodyData = {
    ...req.body,
    transactionId,
  };

  

  const paymentInitiateResult = await paymentService.initiatePaymentInDb(bodyData);

  const { payment_url } = paymentInitiateResult;


  res.status(201).json({ success: true, url: payment_url });
});

//==================== Payment Success Callback =========================//
// This endpoint is called by the payment gateway when the payment is successful.
// It updates the payment status in the database and shows a success page.
const paymentSuccess = catchAsyncHandler(async (req: Request, res: Response) => {
  const { transactionId } = req.query;
  await paymentService.paymentSuccessInDb(transactionId as string);
  res.send(generatePaymentHtml("success"));
});

//==================== Payment Failure Callback =========================//
// This endpoint is called by the payment gateway when the payment fails.
// It updates the payment status in the database and shows a failure page.
const paymentFail = catchAsyncHandler(async (req: Request, res: Response) => {
  const { transactionId } = req.query;
  await paymentService.paymentFailInDb(transactionId as string);
  res.send(generatePaymentHtml("failed"));
});

//==================== Payment Cancellation Callback =========================//
// This endpoint is called by the payment gateway when the user cancels the payment.
// It updates the payment status in the database and shows a cancellation page.
const paymentCancel = catchAsyncHandler(async (req: Request, res: Response) => {
  const { transactionId } = req.query;
  await paymentService.paymentCancelDb(transactionId as string);
  res.send(generatePaymentHtml("cancelled"));
});

//==================== Get Single Payment =========================//
// // This endpoint retrieves a single payment by its ID.
// const getPayment = catchAsyncHandler(async (req: Request, res: Response) => {
//   const payment = await paymentService.(req.params.id);
//   res.status(200).json({ success: true, data: payment });
// });

//==================== Get All Payments =========================//
// This endpoint retrieves all payment records from the database.
const getAllPayments = catchAsyncHandler(async (req: Request, res: Response) => {
  const payments = await paymentService.getAllPayments();
  res.status(200).json({ success: true, data: payments });
});



export const paymentController = {
  initiatePayment,
  paymentCancel,
  paymentFail,
  paymentSuccess,
  getAllPayments

}
