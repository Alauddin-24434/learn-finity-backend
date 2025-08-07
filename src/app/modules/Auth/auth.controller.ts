import type { Request, Response } from "express"
import { catchAsyncHandler } from "../../utils/catchAsyncHandler"
import { AuthService } from "./auth.service"
import { cookieOptions } from "../../utils/cookieOptions"
import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../../utils/jwt"
import { sendResponse } from "../../utils/sendResponse"
import { AppError } from "../../error/AppError"
import { prisma } from "../../lib/prisma"

const register = catchAsyncHandler(async (req: Request, res: Response) => {



  const user = await AuthService.registerUser(req.body)
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
  });
})

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
    message: "User login successfully",
    data: { user, accessToken },
  });
})

const logout = catchAsyncHandler(async (req: Request, res: Response) => {
  res.clearCookie("refreshToken")

  res.status(200).json({
    success: true,
    message: "User logged out successfully",
  })
})



const refreshAccessToken = catchAsyncHandler(async (req: Request, res: Response) => {
  const refreshTokenRaw = req.cookies?.refreshToken || (req.headers["x-refresh-token"] as string);

  if (!refreshTokenRaw) {
    return res.status(401).json({ success: false, message: "Refresh token missing" });
  }

  // ✅ Verify the refresh token
  let decoded;
  try {
    decoded = verifyRefreshToken(refreshTokenRaw);
  } catch (err) {
    return res.status(403).json({ success: false, message: "Invalid or expired refresh token" });
  }

  // ✅ Find the user
  const user = await prisma.user.findUnique({
    where: { id: decoded.id },
  });

  if (!user) {
    return res.status(404).json({ success: false, message: "User not found" });
  }

  // ✅ Generate new access token
  const payload = { id: user.id, isAdmin :user.isAdmin};
  const accessToken = createAccessToken(payload);


  sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Access token refreshed successfully",
    data: { user, accessToken },
  });
});


export const AuthController = {
  register,
  login,
  logout,
  refreshAccessToken
}
