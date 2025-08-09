import { Request, Response } from "express";

import { createAccessToken, createRefreshToken, verifyRefreshToken } from "../../utils/jwt";
import { cookieOptions } from "../../utils/cookieOptions";
import { prisma } from "../../lib/prisma";
import { userService } from "./user.service";
import { loginSchema, updateUserSchema } from "./user.schema";
import { catchAsyncHandler } from "../../utils/catchAsyncHandler";




// =============================================================Get all user==============================================
const getAllUsers = catchAsyncHandler(async (req: Request, res: Response) => {
 

  const result = await userService.getAllUsers();

  const response = {
    success: true,
    message: "Users retrieved successfully",
    data: result,
  };

  res.json(response);
});

//==============================================================Get user byID=================================================
const getUserById = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const user = await userService.getUserById(id);

  const response = {
    success: true,
    message: "User retrieved successfully",
    data: user,
  };

  res.json(response);
});

// ============================================================updateUser======================================================

const updateUser = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;
  const validatedData = updateUserSchema.parse(req.body);
  const user = await userService.updateUser(id, validatedData);

  const payload = { id: user.id, role: user.isAdmin };
  const accessToken = createAccessToken(payload);
  const refreshToken = createRefreshToken(payload);

  res.cookie("refreshToken", refreshToken, {
    ...cookieOptions,
    maxAge: 7 * 24 * 60 * 60 * 1000,
  });

  res.cookie("accessToken", accessToken, {
    ...cookieOptions,
    maxAge: 15 * 60 * 1000,
  });

  const response = {
    success: true,
    message: "User updated successfully",
    data: { user, accessToken },
  };

  res.json(response);
});









// ✅ Final Export Object
export const userController = {


  getAllUsers,
  getUserById,
  updateUser,



};
