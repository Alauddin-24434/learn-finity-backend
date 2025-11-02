import bcrypt from "bcryptjs"
import { prisma } from "../lib/prisma"
import { AppError } from "../error/AppError"

import type { ILoginUser, IRegisterUser } from "../interfaces/auth.interface"
import { IUser } from "../interfaces/user.interfcae"

/**
 * @desc Register a new user
 * @param userData - User input (name, email, password, phone, avatar)
 * @returns Created user (excluding password)
 */
const registerUser = async (userData: IRegisterUser) => {
  // Check if email already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  })
  if (existingUser) throw new AppError(400, "User already exists with this email")

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  // Create new user (exclude password in return)
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
      phone: userData.phone,
      avatar: userData.avatar,
    },
    select: {
      id: true,
      name: true,
      email: true,
      phone: true,
      avatar: true,
      isAdmin: true,
    },
  })

  return user
}

/**
 * @desc Authenticate user with email & password
 * @param loginData - Email & password
 * @returns Authenticated user (excluding password)
 */
const loginUser = async (loginData: ILoginUser) => {
  // Find user by email (include password for comparison)
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      password: true,
      avatar: true,
      courseEnrollments:true
    },
  })
  if (!user) throw new AppError(400, "Invalid email or password")

  // Verify password
  const isPasswordMatched = await bcrypt.compare(loginData.password, user.password)
  if (!isPasswordMatched) throw new AppError(400, "Invalid email or password")

  // Exclude password before returning
  const { password, ...userWithoutPassword } = user
  return userWithoutPassword
}




export const AuthService = {
  registerUser,
  loginUser,
}



