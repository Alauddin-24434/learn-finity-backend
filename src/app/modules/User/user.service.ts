



import { prisma } from "../../lib/prisma";






// 2. Get All Users
const getAllUsers = async () => {

    const user = await prisma.user.findMany();
 
 return user;

  
};


// 3. Get User By ID
const getUserById = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },

  });

  if (!user) {
    throw new Error("User not found");
  }

  return user;
};

// 4. Update User
const updateUser = async (id: string, data: any) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  return await prisma.user.update({
    where: { id },
    data,
    select: {
      id: true,
      isAdmin: true,
      email: true,

      updatedAt: true,
    },
  });
};

// 5. Delete User
const deleteUser = async (id: string) => {
  const user = await prisma.user.findUnique({ where: { id } });
  if (!user) {
    throw new Error("User not found");
  }

  await prisma.user.delete({ where: { id } });
  return { message: "User deleted successfully" };
};



// ✅ Final Export Object
export const userService = {

  getAllUsers,
  getUserById,
  updateUser,
  deleteUser,

};
