import dotenv from "dotenv"

// Load .env file depending on environment
dotenv.config()

export const envVariable = {
  PORT: process.env.PORT || 5000,

  // JWT Secrets and Expiry
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  // ✅ These should be explicitly typed to satisfy `jsonwebtoken`
  JWT_ACCESS_TOKEN_EXPIRES_IN: (process.env.JWT_ACCESS_TOKEN_EXPIRATION ||
    "15m") as `${number}${"s" | "m" | "h" | "d"}`,
  JWT_REFRESH_TOKEN_EXPIRES_IN: (process.env.JWT_REFRESH_TOKEN_EXPIRATION ||
    "7d") as `${number}${"s" | "m" | "h" | "d"}`,

  // AamarPay Payment Config
  AAMARPAY_STORE_ID: process.env.AAMARPAY_STORE_ID || "",
  AAMARPAY_SIGNATURE_KEY: process.env.AAMARPAY_SIGNATURE_KEY || "",
  SUCCESS_URL: process.env.SUCCESS_URL || "",
  FAIL_URL: process.env.FAIL_URL || "",
  CANCEL_URL: process.env.CANCEL_URL || "",

  NODE_ENV: process.env.NODE_ENV,
  CLIENT_URL: process.env.CLIENT_URL,
}
