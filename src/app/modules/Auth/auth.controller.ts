import type { Request, Response } from "express"
import { catchAsyncHandler } from "../../utils/catchAsyncHandler"
import { AuthService } from "./auth.service"
import { cookieOptions } from "../../utils/cookieOptions"
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../../utils/jwt"
import { sendResponse } from "../../utils/sendResponse"
import { prisma } from "../../lib/prisma"

/*
===================================================================================
  Handles user registration.
  Accepts name, email, password, phone, and optional avatar upload.
  Creates user in the database and returns access & refresh tokens.
  =====================================================================================
*/
const register = catchAsyncHandler(async (req: Request, res: Response) => {
  const avatar = req.file?.path

  const body = {
    ...req.body,
    avatar,
  }

  const user = await AuthService.registerUser(body)

  const jwtPayload = {
    id: user.id,
    email: user.email,
  }

  const refreshToken = createRefreshToken(jwtPayload)
  const accessToken = createAccessToken(jwtPayload)

  res.cookie("refreshToken", refreshToken, cookieOptions)

  sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "User registered successfully",
    data: { user, accessToken },
  })
})

/*
=============================================================================
  Handles user login.
  Validates credentials, generates tokens, and stores refresh token in cookie.
  ==============================================================================
*/
const login = catchAsyncHandler(async (req: Request, res: Response) => {
  const user = await AuthService.loginUser(req.body)

  const jwtPayload = {
    id: user.id,
    email: user.email,
  }

  const refreshToken = createRefreshToken(jwtPayload)
  const accessToken = createAccessToken(jwtPayload)

  res.cookie("refreshToken", refreshToken, cookieOptions)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "User login successful",
    data: { user, accessToken },
  })
})

/*
===============================================================================
  Logs out the user by clearing the refresh token cookie.
===============================================================================
*/
const logout = catchAsyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken")

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  })
})

/*
======================================================================================
  Generates a new access token using a valid refresh token.
  Refresh token can be sent via cookie or 'x-refresh-token' header.
======================================================================================
*/
const refreshAccessToken = catchAsyncHandler(async (req: Request, res: Response) => {
  const refreshTokenRaw = req.cookies?.refreshToken || (req.headers["x-refresh-token"] as string)

  if (!refreshTokenRaw) {
    return res.status(401).json({ success: false, message: "Refresh token missing" })
  }

  let decoded
  try {
    decoded = verifyRefreshToken(refreshTokenRaw)
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token" })
  }

  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  })

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" })
  }

  const payload = { id: user.id, isAdmin: user.isAdmin }
  const accessToken = createAccessToken(payload)

  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token refreshed successfully",
    data: { user, accessToken },
  })
})

export const AuthController = {
  register,
  login,
  logout,
  refreshAccessToken,
}
