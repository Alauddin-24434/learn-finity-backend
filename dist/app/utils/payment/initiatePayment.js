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
exports.initiatePayment = void 0;
const axios_1 = __importDefault(require("axios"));
const config_1 = require("../../config");
// 🔁 Initiate Payment Request to AamarPay
const initiatePayment = (_a) => __awaiter(void 0, [_a], void 0, function* ({ name, email, phone, amount, transactionId, }) {
    const payload = {
        store_id: config_1.envVariable.AAMARPAY_STORE_ID,
        signature_key: config_1.envVariable.AAMARPAY_SIGNATURE_KEY,
        currency: "BDT",
        amount,
        cus_country: "Bangladesh",
        tran_id: transactionId,
        success_url: `${config_1.envVariable.SUCCESS_URL}?transactionId=${transactionId}`,
        fail_url: `${config_1.envVariable.FAIL_URL}?transactionId=${transactionId}`,
        cancel_url: `${config_1.envVariable.CANCEL_URL}?transactionId=${transactionId}`,
        cus_name: name,
        cus_email: email,
        cus_phone: phone,
        desc: `Academic Payment`,
        type: "json",
    };
    const response = yield axios_1.default.post("https://sandbox.aamarpay.com/jsonpost.php", payload);
    return response.data;
});
exports.initiatePayment = initiatePayment;
