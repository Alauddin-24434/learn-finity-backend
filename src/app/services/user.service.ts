import { prisma } from "../lib/prisma"
import { AppError } from "../error/AppError"
import { IUser } from "../interfaces/user.interfcae"

/**
 * @desc Get all users (excluding password)
 * @returns Array of user objects
 */
const getAllUsers = async () => {
  return await prisma.user.findMany({
    where: { isDeleted: false }, // Ignore soft-deleted users
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
}

/**
 * @desc Update user by ID
 * @param id - User ID
 * @param data - Fields to update
 * @returns Updated user object (excluding password)
 * @throws AppError if user not found
 */
const updateUser = async (id: string, data: IUser) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user || user.isDeleted) throw new AppError(404, "User not found")

  return await prisma.user.update({
    where: { id },
    data,
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
}

/**
 * @desc Soft delete user by ID
 * @param id - User ID
 * @returns Success message
 * @throws AppError if user not found
 */
const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user || user.isDeleted) throw new AppError(404, "User not found")

  await prisma.user.update({ where: { id }, data: { isDeleted: true } })

  return { message: "User deleted successfully" }
}

export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,
}
