import { AppError } from "../../error/AppError"
import { prisma } from "../../lib/prisma"
import { initiatePayment } from "../../paymentIntegration/initiate.payment"
import { verifyPayment } from "../../paymentIntegration/verifyPayment"
import { IPaymentInput } from "./payment.interface"

//================ Initiate Payment =================//
const initiatePaymentInDb = async (paymentData: IPaymentInput) => {
  const { amount, userId, transactionId, provider, courseId, currency, phone } = paymentData;

  try {
    // প্রথমে ডাটাবেসে পেমেন্ট রেকর্ড তৈরি
    const user = await prisma.user.findFirst({ where: { id: userId } });
    if (!user) throw new AppError(404, "User not found");

    await prisma.payment.create({
      data: {
        amount,
        userId,
        transactionId,
        provider,
        courseId,
        currency,
        status: "PENDING",
        phone,
      },
    });

    // তারপর পেমেন্ট ইনিশিয়েট করুন (ট্রানজেকশনের বাইরে)
    const paymentInitiateResult = await initiatePayment({
      name: user.name,
      email: user.email,
      phone,
      amount,
      transactionId,
      currency,
    });

    // console.log("paymentInitiateResult",paymentInitiateResult)

    return paymentInitiateResult;
  } catch (error) {
    console.error("❌ Payment initiation failed:", error);
    throw new AppError(500, "Payment initiation failed");
  }
};

//================ Payment Success =================//
const paymentSuccessInDb = async (transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    const verificationResult = await verifyPayment(transactionId)
    if (!verificationResult) throw new AppError(400, "Payment verification failed")

    const payment = await tx.payment.findUnique({ where: { transactionId } })
    if (!payment) throw new AppError(404, "Payment record not found")

    if (verificationResult.pay_status === "Successful") {
      // Update status to PAID
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID" },
      })

      // Now enroll the user
      await tx.enrollment.create({
        data: {
          userId: payment.userId,
          courseId: payment.courseId,
        },
      })
    }

    return transactionId
  })
}

//================ Payment Fail =================//
const paymentFailInDb = async (transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    const verificationResult = await verifyPayment(transactionId)
    if (!verificationResult) throw new AppError(400, "Payment verification failed")

    const payment = await tx.payment.findUnique({ where: { transactionId } })
    if (!payment) throw new AppError(404, "Payment record not found")

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "FAILED" },
    })

    return transactionId
  })
}

//================ Payment Cancel =================//
const paymentCancelDb = async (transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    const payment = await tx.payment.findUnique({ where: { transactionId } })
    if (!payment) throw new AppError(404, "Payment record not found")

    await tx.payment.update({
      where: { id: payment.id },
      data: { status: "CANCELLED" },
    })

    return transactionId
  })
}

//================ Get Single Payment =================//
const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({ where: { id } })
  if (!payment) throw new AppError(404, "Payment not found")
  return payment
}

//================ Get All Payments =================//
const getAllPayments = async () => {
  return prisma.payment.findMany()
}

//================ Export Service =================//
export const paymentService = {
  initiatePaymentInDb,
  paymentSuccessInDb,
  paymentFailInDb,
  paymentCancelDb,
  getPaymentById,
  getAllPayments,
}
