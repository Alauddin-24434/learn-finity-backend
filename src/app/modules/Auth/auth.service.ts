import bcrypt from "bcryptjs"
import { prisma } from "../../lib/prisma"
import { AppError } from "../../error/AppError"

import type { ILoginUser, IRegisterUser } from "./auth.interface"

const registerUser = async (userData: IRegisterUser) => {
  // Check if user already exists
  const existingUser = await prisma.user.findUnique({
    where: { email: userData.email },
  })

  if (existingUser) {
    throw new AppError(400, "User already exists with this email")
  }

  // Hash password
  const hashedPassword = await bcrypt.hash(userData.password, 12)

  // Create user
  const user = await prisma.user.create({
    data: {
      name: userData.name,
      email: userData.email,
      password: hashedPassword,
    },
    select: {
      id: true,
      name: true,
      email: true,
      avatar: true,
      isAdmin: true
    },
  })

  return user;


}


export const loginUser = async (loginData: ILoginUser) => {
  // Step 1: Find user by email and include password
  const user = await prisma.user.findUnique({
    where: { email: loginData.email },
    select: {
      id: true,
      name: true,
      email: true,
      isAdmin: true,
      password: true, // include password for comparison
    },
  });

  if (!user) {
    throw new AppError(401, "Invalid email or password");
  }

  // Step 2: Compare password
  const isPasswordMatched = await bcrypt.compare(loginData.password, user.password);
  if (!isPasswordMatched) {
    throw new AppError(401, "Invalid email or password");
  }

  // Step 3: Remove password before returning user
  const { password, ...userWithoutPassword } = user;
  return userWithoutPassword;
};


export const AuthService = {
  registerUser,
  loginUser,
}
