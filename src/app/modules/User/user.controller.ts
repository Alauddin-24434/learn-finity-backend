import { Request, Response } from "express"
import { userService } from "./user.service"
import { catchAsyncHandler } from "../../utils/catchAsyncHandler"
import { createAccessToken, createRefreshToken } from "../../utils/jwt"
import { cookieOptions } from "../../utils/cookieOptions"

// =============================
// Get all users
// Returns list of users excluding password
// =============================
const getAllUsers = catchAsyncHandler(async (req: Request, res: Response) => {
  const result = await userService.getAllUsers()

  res.json({
    success: true,
    message: "Users retrieved successfully",
    data: result,
  })
})



// =============================
// Update user by ID
// Returns updated user and new access token
// =============================
const updateUser = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const validatedData = req.body // You can use Zod/Validator here
  const user = await userService.updateUser(id, validatedData)

  const payload = { id: user.id, role: user.isAdmin }
  const accessToken = createAccessToken(payload)
  const refreshToken = createRefreshToken(payload)

  // Set cookies for new tokens
  res.cookie("refreshToken", refreshToken, cookieOptions)

  res.json({
    success: true,
    message: "User updated successfully",
    data: { user, accessToken },
  })
})

// =============================
// Soft delete user by ID
// Marks user as deleted
// =============================
const deleteUser = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params
  const user = await userService.deleteUser(id)

  res.json({
    success: true,
    message: user.message,
  })
})

// ✅ Exported controller object
export const userController = {
  getAllUsers,
  
  updateUser,
  deleteUser,
}
