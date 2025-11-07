import type { CookieOptions } from "express"
import { envVariable } from "../config"

export const cookieOptions: CookieOptions = {
  httpOnly: true,
  secure: envVariable.NODE_ENV === "production",
  sameSite: "lax",
  maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days in milliseconds
}
