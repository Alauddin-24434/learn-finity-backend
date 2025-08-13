



import { prisma } from "../../lib/prisma";






// 2. Get All Users
const getAllUsers = async () => {

  const user = await prisma.user.findMany();

  return user;


};


// 3. Get User By ID
const getMe = async (id: string) => {
  const user = await prisma.user.findUnique({
    where: { id },
    include: {
      courseEnrollments: {
        select: {
          course: {
            include: {
              author: true,
              category: true,
              lessons: true,
              enrollments: true,
            },
          }
        }
      }
    }
  });

  if (!user) {
    throw new Error("User not found");
  }

  // শুধু course অ্যারে বানানো
  const courses = user.courseEnrollments.map(e => e.course);

  // courseEnrollments ও password বাদ দিয়ে নতুন অবজেক্ট রিটার্ন
  const { courseEnrollments, password, ...rest } = user;

  return {
    ...rest,
    courses
  };
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
  updateUser,
  deleteUser,
  getMe

};
