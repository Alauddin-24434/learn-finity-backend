import axios from "axios";
import { envVariable } from "../config";

// 🧾 Type: Payment Payload
export interface PaymentPayload {
  name: string;
  email: string;
  phone: string;
  amount: number;
  transactionId: string;
  currency:string;


}

// 🎯 Type: Expected AamarPay Response
export interface AamarPayResponse {
  payment_url?: string;
  [key: string]: any;
}

// 🔁 Initiate Payment Request to AamarPay
export const initiatePayment = async ({

  name,
  email,
  phone,
  amount,
  transactionId,
  currency,

}: PaymentPayload): Promise<AamarPayResponse> => {
  const payload = {
    store_id: envVariable.AAMARPAY_STORE_ID,
    signature_key: envVariable.AAMARPAY_SIGNATURE_KEY,
    currency: currency,
    amount,
    cus_country: "Bangladesh",
    tran_id: transactionId,
    success_url: `${envVariable.SUCCESS_URL}?transactionId=${transactionId}`,
    fail_url: `${envVariable.FAIL_URL}?transactionId=${transactionId}`,
    cancel_url: `${envVariable.CANCEL_URL}?transactionId=${transactionId}`,
    cus_name: name,
    cus_email: email,
    cus_phone: phone,
    desc: `Academic Payment`,
    type: "json",
  };

  const response = await axios.post("https://sandbox.aamarpay.com/jsonpost.php", payload);

  return response.data;
};