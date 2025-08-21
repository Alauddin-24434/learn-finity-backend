import { prisma } from "../../lib/prisma"

// =============================
// Get all users (excluding password)
// =============================
const getAllUsers = async () => {
  const users = await prisma.user.findMany({
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

  return users
}




// =============================
// Update user by ID
// Returns updated user (excluding password)
// =============================
const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw new Error("User not found")
  }

  const updatedUser = await prisma.user.update({
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

  return updatedUser
}

// =============================
// Soft delete user by ID
// Marks user as deleted instead of removing from DB
// =============================
const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } })
  if (!user) {
    throw new Error("User not found")
  }

  await prisma.user.update({ where: { id }, data: { isDeleted: true } })

  return { message: "User deleted successfully" }
}

// ✅ Exported service object
export const userService = {
  getAllUsers,
  updateUser,
  deleteUser,

}
