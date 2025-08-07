



import { prisma } from "../../lib/prisma";






// 2. Get All Users
const getAllUsers = async (query: any, isAdmin: boolean) => {
  const page = Number.parseInt(query.page || "1");
  const limit = Number.parseInt(query.limit || "10");
  const skip = (page - 1) * limit;

  // Search Filter
  const searchFilter = query.search
    ? {
      OR: [
        { name: { contains: query.search, mode: "insensitive" as const } },
        { email: { contains: query.search, mode: "insensitive" as const } },
      ],
    }
    : {};

  // Role Filter Logic
  let roleFilter: any = {};
  if (isAdmin) {
    roleFilter = {
      role: {
        in: ["GUEST", "STUDENT"],
      },
    };
  } else if (!isAdmin) {
    // যদি SUPER_ADMIN না হয় এবং ADMIN না হয়, ফাঁকা রিটার্ন দাও
    return {
      data: [],
      pagination: {
        page,
        limit,
        total: 0,
        totalPages: 0,
        hasNext: false,
        hasPrev: false,
      },
    };
  }

  const where = {
    ...searchFilter,
    ...roleFilter,
  };

  // Query Run
  const [users, total] = await Promise.all([
    prisma.user.findMany({
      where,
      skip,
      take: limit,
      orderBy: { createdAt: "desc" },
    }),
    prisma.user.count({ where }),
  ]);

  return {
    data: users,
    pagination: {
      page,
      limit,
      total,
      totalPages: Math.ceil(total / limit),
      hasNext: page < Math.ceil(total / limit),
      hasPrev: page > 1,
    },
  };
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
