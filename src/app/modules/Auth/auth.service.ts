import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../error/AppError"

import type { ILoginUser, IRegisterUser } from "./auth.interface"

/*
==============================================================================
  Registers a new user with name, email, password, phone, and optional avatar.
  Returns the created user object without the password.
==============================================================================
*/
const registerUser = async (userData: IRegisterUser) => {
  // Check if user already exists with the same email
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  })

  if (existingUser) {
    throw new AppError(400, "User already exists with this email")
  }

  // TODO: Normalize email (lowercase & trim) before saving to avoid duplicates
  // userData.email = userData.email.trim().toLowerCase();

  // TODO: Enforce strong password policy before hashing (min length, special char, number, uppercase)

  // Hash password with bcrypt (12 salt rounds)
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  // Create user in the database & select only safe fields (exclude password)
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
      createdAt: true,
      updatedAt: true,
    },
  })

  return user
}

/*
============================================================================
  Logs in a user using email and password.
  Returns the user object without the password if authentication succeeds.
============================================================================
*/
export const loginUser = async (loginData: ILoginUser) => {
 
  // Step 1: Find user by email & include password for verification
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      password: true, // Needed for password comparison
    },
  })

  // If user not found, throw error
  if (!user) {
    throw new AppError(400, "Invalid email or password")
  }

  // Step 2: Compare provided password with stored hash
  const isPasswordMatched = await bcrypt.compare(loginData.password, user.password)
  console.log("Password match:", isPasswordMatched)

  if (!isPasswordMatched) {
    throw new AppError(400, "Invalid email or password")
  }

  // Step 3: Remove password before returning
  const { password, ...userWithoutPassword } = user

  // TODO: Implement login attempt limit / rate-limiting to prevent brute force attacks

  return userWithoutPassword
}

export const AuthService = {
  registerUser,
  loginUser,
}
