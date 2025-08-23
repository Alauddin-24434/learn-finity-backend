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
exports.paymentService = void 0;
const AppError_1 = require("../error/AppError");
const prisma_1 = require("../lib/prisma");
const initiate_payment_1 = require("../utils/initiate.payment");
const verifyPayment_1 = require("../utils/verifyPayment");
/**
 * @desc Initiate a payment in DB and external provider
 * @param paymentData - Payment input (amount, userId, courseId, provider, transactionId, currency, phone)
 * @returns Result from payment provider
 * @throws AppError if user not found or initiation fails
 */
const initiatePaymentInDb = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, userId, transactionId, provider, courseId, currency, phone } = paymentData;
    const user = yield prisma_1.prisma.user.findFirst({ where: { id: userId } });
    if (!user)
        throw new AppError_1.AppError(404, "User not found");
    yield prisma_1.prisma.payment.create({
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
    const paymentInitiateResult = yield (0, initiate_payment_1.initiatePayment)({
        name: user.name,
        email: user.email,
        phone,
        amount,
        transactionId,
        currency,
    });
    return paymentInitiateResult;
});
/**
 * @desc Handle payment success
 * @param transactionId - Transaction ID to verify
 * @returns Transaction ID
 * @throws AppError if payment verification fails or payment record not found
 */
const paymentSuccessInDb = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verificationResult = yield (0, verifyPayment_1.verifyPayment)(transactionId);
        if (!verificationResult)
            throw new AppError_1.AppError(400, "Payment verification failed");
        const payment = yield tx.payment.findUnique({ where: { transactionId } });
        if (!payment)
            throw new AppError_1.AppError(404, "Payment record not found");
        if (verificationResult.pay_status === "Successful") {
            yield tx.payment.update({
                where: { id: payment.id },
                data: { status: "PAID" },
            });
            yield tx.enrollment.create({
                data: {
                    userId: payment.userId,
                    courseId: payment.courseId,
                },
            });
        }
        return transactionId;
    }));
});
/**
 * @desc Handle payment failure
 * @param transactionId - Transaction ID to verify
 * @returns Transaction ID
 * @throws AppError if verification fails or payment record not found
 */
const paymentFailInDb = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verificationResult = yield (0, verifyPayment_1.verifyPayment)(transactionId);
        if (!verificationResult)
            throw new AppError_1.AppError(400, "Payment verification failed");
        const payment = yield tx.payment.findUnique({ where: { transactionId } });
        if (!payment)
            throw new AppError_1.AppError(404, "Payment record not found");
        yield tx.payment.update({
            where: { id: payment.id },
            data: { status: "FAILED" },
        });
        return transactionId;
    }));
});
/**
 * @desc Handle payment cancellation
 * @param transactionId - Transaction ID
 * @returns Transaction ID
 * @throws AppError if payment record not found
 */
const paymentCancelDb = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const payment = yield tx.payment.findUnique({ where: { transactionId } });
        if (!payment)
            throw new AppError_1.AppError(404, "Payment record not found");
        yield tx.payment.update({
            where: { id: payment.id },
            data: { status: "CANCELLED" },
        });
        return transactionId;
    }));
});
/**
 * @desc Get single payment by ID
 * @param id - Payment ID
 * @returns Payment object
 * @throws AppError if payment not found
 */
const getPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.prisma.payment.findUnique({ where: { id } });
    if (!payment)
        throw new AppError_1.AppError(404, "Payment not found");
    return payment;
});
/**
 * @desc Get all payments
 * @returns Array of payment objects
 */
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.payment.findMany();
});
/**
 * @desc Exported payment service with all CRUD and status operations
 */
exports.paymentService = {
    initiatePaymentInDb,
    paymentSuccessInDb,
    paymentFailInDb,
    paymentCancelDb,
    getPaymentById,
    getAllPayments,
};
