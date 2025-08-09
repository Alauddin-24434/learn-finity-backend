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
const AppError_1 = require("../../error/AppError");
const prisma_1 = require("../../lib/prisma");
const initiate_payment_1 = require("../../paymentIntegration/initiate.payment");
const verifyPayment_1 = require("../../paymentIntegration/verifyPayment");
//================ Initiate Payment =================//
const initiatePaymentInDb = (paymentData) => __awaiter(void 0, void 0, void 0, function* () {
    const { amount, userId, transactionId, provider, courseId, currency, phone } = paymentData;
    try {
        // প্রথমে ডাটাবেসে পেমেন্ট রেকর্ড তৈরি
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
        // তারপর পেমেন্ট ইনিশিয়েট করুন (ট্রানজেকশনের বাইরে)
        const paymentInitiateResult = yield (0, initiate_payment_1.initiatePayment)({
            name: user.name,
            email: user.email,
            phone,
            amount,
            transactionId,
            currency,
        });
        // console.log("paymentInitiateResult",paymentInitiateResult)
        return paymentInitiateResult;
    }
    catch (error) {
        console.error("❌ Payment initiation failed:", error);
        throw new AppError_1.AppError(500, "Payment initiation failed");
    }
});
//================ Payment Success =================//
const paymentSuccessInDb = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    return yield prisma_1.prisma.$transaction((tx) => __awaiter(void 0, void 0, void 0, function* () {
        const verificationResult = yield (0, verifyPayment_1.verifyPayment)(transactionId);
        if (!verificationResult)
            throw new AppError_1.AppError(400, "Payment verification failed");
        const payment = yield tx.payment.findUnique({ where: { transactionId } });
        if (!payment)
            throw new AppError_1.AppError(404, "Payment record not found");
        if (verificationResult.pay_status === "Successful") {
            // Update status to PAID
            yield tx.payment.update({
                where: { id: payment.id },
                data: { status: "PAID" },
            });
            // Now enroll the user
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
//================ Payment Fail =================//
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
//================ Payment Cancel =================//
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
//================ Get Single Payment =================//
const getPaymentById = (id) => __awaiter(void 0, void 0, void 0, function* () {
    const payment = yield prisma_1.prisma.payment.findUnique({ where: { id } });
    if (!payment)
        throw new AppError_1.AppError(404, "Payment not found");
    return payment;
});
//================ Get All Payments =================//
const getAllPayments = () => __awaiter(void 0, void 0, void 0, function* () {
    return prisma_1.prisma.payment.findMany();
});
//================ Export Service =================//
exports.paymentService = {
    initiatePaymentInDb,
    paymentSuccessInDb,
    paymentFailInDb,
    paymentCancelDb,
    getPaymentById,
    getAllPayments,
};
