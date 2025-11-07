import dotenv from "dotenv";

// Load .env file depending on environment
dotenv.config();

export const envVariable = {
  PORT: process.env.PORT,
 
  // JWT Secrets and Expiry
  JWT_ACCESS_TOKEN_SECRET: process.env.JWT_ACCESS_TOKEN_SECRET!,
  JWT_REFRESH_TOKEN_SECRET: process.env.JWT_REFRESH_TOKEN_SECRET!,
  // ✅ These should be explicitly typed to satisfy `jsonwebtoken`
  JWT_ACCESS_TOKEN_EXPIRES_IN: (process.env.JWT_ACCESS_TOKEN_EXPIRATION ||
    "15m") as `${number}${"s" | "m" | "h" | "d"}`,
  JWT_REFRESH_TOKEN_EXPIRES_IN: (process.env.JWT_REFRESH_TOKEN_EXPIRATION ||
    "7d") as `${number}${"s" | "m" | "h" | "d"}`,

  NODE_ENV: process.env.NODE_ENV,
};



