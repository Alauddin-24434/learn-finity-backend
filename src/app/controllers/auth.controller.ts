import type { Request, Response } from "express"
import { catchAsyncHandler } from "../utils/catchAsyncHandler"
import { AuthService } from "../services/auth.service"
import { cookieOptions } from "../utils/cookieOptions"
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../utils/jwt"
import { sendResponse } from "../utils/sendResponse"
import { prisma } from "../lib/prisma"
import { AppError } from "../error/AppError"

/**
 * @desc Register a new user
 * @route POST /auth/register
 * @access Public
 */
const register = catchAsyncHandler(async (req: Request, res: Response) => {
  const avatar = req.file?.path
  const body = { ...req.body, avatar }

  const user = await AuthService.registerUser(body)

  const jwtPayload = { id: user.id, email: user.email }
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

/**
 * @desc Authenticate user & issue tokens
 * @route POST /auth/login
 * @access Public
 */
const login = catchAsyncHandler(async (req: Request, res: Response) => {


  const user = await AuthService.loginUser(req.body)

  const jwtPayload = { id: user.id, email: user.email }
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

/**
 * @desc Log out user (clear refresh token cookie)
 * @route POST /auth/logout
 * @access Private
 */
const logout = catchAsyncHandler(async (_req: Request, res: Response) => {
  res.clearCookie("refreshToken")
  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  })
})

/**
 * @desc Issue new access token using refresh token
 * @route POST /auth/refresh
 * @access Public
 */
const refreshAccessToken = catchAsyncHandler(async (req: Request, res: Response) => {
  const refreshToken = req.cookies?.refreshToken || req.headers["x-refresh-token"]
  if (!refreshToken) throw new AppError(401, "Refresh token missing")

  const decoded = verifyRefreshToken(refreshToken)
  if (!decoded) throw new AppError(403, "Invalid or expired refresh token")

  const user = await prisma.user.findUnique({ where: { id: decoded.id } })
  if (!user) throw new AppError(403, "User not found")

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
