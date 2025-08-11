

// services/course.service.ts
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib/prisma";
import { IUser } from "../User/user.interfcae";
import { ICourse } from "./course.interface";

const createCourse = async (data: ICourse) => {
  const exists = await prisma.course.findFirst({
    where: {
      title: data.title,
      authorId: data.authorId,
    },
  });

  if (exists) throw new AppError(400, "Course with this title already exists for this author");

  return prisma.course.create({
    data: {
      title: data.title,
      thumbnail: data.thumbnail,
      price: Number(data.price),
      isFree: Boolean(data.isFree),
      description: data.description,
      authorId: data.authorId,
      categoryId: data.categoryId,
      features: data.features,
      stack: data.stack,
      overviews: data.overviews
    }
  });
};


const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: true,
    },
  });
  if (!course) throw new AppError(404, "Course not found");
  return course;
};


const getAllCourses = async (query: any) => {

  let { category, searchTerm, sort, page, limit } = query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
  const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {};

  if (category) {
    where.category = {
      name: {
        contains: category,
        mode: "insensitive",
      },
    };
  }

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      // { stack: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  let orderBy = {};
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else orderBy = { createdAt: "desc" };

  // get total count for pagination
  const totalCourses = await prisma.course.count({ where });

  // get courses list
  const courses = await prisma.course.findMany({
    where,
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: true,
    },
    orderBy,
    skip,
    take: limitNumber,
  });

  const totalPages = Math.ceil(totalCourses / limitNumber);

  return {
    courses,
    totalPages,
    currentPage: pageNumber,
    totalCourses,
  };
};

const getMyCourses = async (mixup: any) => {
  let { category, searchTerm, sort, page, limit, id } = mixup;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
  const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {};

  // ✅ filter only by this user's courses
  if (id) {
    where.authorId = id;
  }

  if (category) {
    where.category = {
      name: {
        contains: category,
        mode: "insensitive",
      },
    };
  }

  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  let orderBy = {};
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else orderBy = { createdAt: "desc" };

  // get total count for pagination
  const totalCourses = await prisma.course.count({ where });

  // get courses list with payments
  const coursesData = await prisma.course.findMany({
    where,
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: true,
      payments: {
        where: { status: "PAID" }, // ✅ only paid payments
        select: { amount: true, status: true }
      }
    },
    orderBy,
    skip,
    take: limitNumber,
  });

  // ✅ calculate total paid amount for each course
  const courses = coursesData.map(course => {
    const totalEarn = course.payments.reduce(
      (sum, payment) => sum + payment.amount,
      0
    );
    return {
      ...course,
      totalEarn
    };
  });

  const totalPages = Math.ceil(totalCourses / limitNumber);

  return {
    courses,
    totalPages,
    currentPage: pageNumber,
    totalCourses,
  };
};






const updateCourseById = async (id: string, data: Partial<ICourse>) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.update({ where: { id }, data });
};
// soft deleet
const deleteCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.update({
    where: { id }, data: {
      isDeleted: true
    }
  });
};

export const courseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById,
  getMyCourses
};
