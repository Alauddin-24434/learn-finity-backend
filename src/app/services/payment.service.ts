import { AppError } from "../error/AppError"
import { prisma } from "../lib/prisma"

import { IPaymentInput } from "../interfaces/payment.interface"
import { initiatePayment } from "../utils/initiate.payment"
import { verifyPayment } from "../utils/verifyPayment"

/**
 * @desc Initiate a payment in DB and external provider
 * @param paymentData - Payment input (amount, userId, courseId, provider, transactionId, currency, phone)
 * @returns Result from payment provider
 * @throws AppError if user not found or initiation fails
 */
const initiatePaymentInDb = async (paymentData: IPaymentInput) => {
  const { amount, userId, transactionId, provider, courseId, currency, phone } = paymentData

  const user = await prisma.user.findFirst({ where: { id: userId } })
  if (!user) throw new AppError(404, "User not found")

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
  })

  const paymentInitiateResult = await initiatePayment({
    name: user.name,
    email: user.email,
    phone,
    amount,
    transactionId,
    currency,
  })

  return paymentInitiateResult
}

/**
 * @desc Handle payment success
 * @param transactionId - Transaction ID to verify
 * @returns Transaction ID
 * @throws AppError if payment verification fails or payment record not found
 */
const paymentSuccessInDb = async (transactionId: string) => {
  return await prisma.$transaction(async (tx) => {
    const verificationResult = await verifyPayment(transactionId)
    if (!verificationResult) throw new AppError(400, "Payment verification failed")

    const payment = await tx.payment.findUnique({ where: { transactionId } })
    if (!payment) throw new AppError(404, "Payment record not found")

    if (verificationResult.pay_status === "Successful") {
      await tx.payment.update({
        where: { id: payment.id },
        data: { status: "PAID" },
      })

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

/**
 * @desc Handle payment failure
 * @param transactionId - Transaction ID to verify
 * @returns Transaction ID
 * @throws AppError if verification fails or payment record not found
 */
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

/**
 * @desc Handle payment cancellation
 * @param transactionId - Transaction ID
 * @returns Transaction ID
 * @throws AppError if payment record not found
 */
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

/**
 * @desc Get single payment by ID
 * @param id - Payment ID
 * @returns Payment object
 * @throws AppError if payment not found
 */
const getPaymentById = async (id: string) => {
  const payment = await prisma.payment.findUnique({ where: { id } })
  if (!payment) throw new AppError(404, "Payment not found")
  return payment
}

/**
 * @desc Get all payments
 * @returns Array of payment objects
 */
const getAllPayments = async () => {
  return prisma.payment.findMany()
}

/**
 * @desc Exported payment service with all CRUD and status operations
 */
export const paymentService = {
  initiatePaymentInDb,
  paymentSuccessInDb,
  paymentFailInDb,
  paymentCancelDb,
  getPaymentById,
  getAllPayments,
}
