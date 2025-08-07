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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.verifyPayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
// 🔍 Verify Payment using AamarPay API
const verifyPayment = (transactionId) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const verificationUrl = `https://sandbox.aamarpay.com/api/v1/trxcheck/request.php`;
        const response = yield axios_1.default.get(verificationUrl, {
            params: {
                store_id: config_1.envVariable.AAMARPAY_STORE_ID,
                signature_key: config_1.envVariable.AAMARPAY_SIGNATURE_KEY,
                request_id: transactionId,
                type: "json",
            },
        });
        const { pay_status, amount, status_title, payment_type } = response.data;
        return { pay_status, amount, status_title, payment_type };
    }
    catch (error) {
        return {
            status: "error",
            message: "Verification failed",
            error: error.message || error,
        };
    }
});
exports.verifyPayment = verifyPayment;
