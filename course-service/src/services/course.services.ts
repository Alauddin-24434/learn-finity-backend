import da from "zod/v4/locales/da.js";
import { AppError } from "../errors/appError";
import { ICourse, ICourseCategory } from "../interfaces/course.interfaces";
import prisma from "../lib/prismaClient";

const createCourse = async (data: ICourse) => {
 
  const course = await prisma.course.create({
    data: {
      title: data.title,
      thumbnail: data.thumbnail,
      overviewUrl:data.overviewUrl,
      price: Number(data.price),
      isFree: data.isFree ? true : false,
      description: data.description,
      authorId: data.authorId,
      categoryId: data.categoryId,
      features: data.features,
      stack: data.stack,
      overviews: data.overviews,
    },
  });


  return course;
};


const createCourseCategory = async (data: ICourseCategory) => {
  
  return prisma.category.create({
    data: {
      name: data.name,
    },
  });
};

/**
 * @desc Get course by ID with lessons, author, category, and enrollment info
 * @param id - Course ID
 * @param userId - User ID (to check enrollment)
 * @returns Course object with lessonsCount, enrollmentsCount, isEnrolled
 * @throws AppError if course not found or deleted
 */
const getCourseById = async (id: string, userId: string) => {
  const course = await prisma.course.findUnique({
    where: { id, isDeleted: false }, // ✅ only active courses
    include: {
      // author: true,
      category: true,
      Videos: true,
    },
  });
  if (!course) throw new AppError(404, "Course not found");

  const { Videos, ...rest } = course;
  return {
    ...rest,
    lessonsCount: Videos.length,
    // enrollmentsCount: await prisma..count({ where: { courseId: id } }),
  };
};

/**
 * @desc Get all courses with filters, pagination, sorting
 * @param query - category, searchTerm, sort, page, limit
 * @returns Object with courses, totalPages, currentPage, totalCourses
 */
const getAllCourses = async (query: any) => {
  let { category, searchTerm, sort, page, limit } = query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
  const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = { isDeleted: false }; // ✅ only active courses

  if (category) {
    where.category = { name: { contains: category, mode: "insensitive" } };
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

  const totalCourses = await prisma.course.count({ where });

  // const courses = await prisma.course.findMany({
  //   where,
  //   include: { author: true, category: true, lessons: true, enrollments: true },
  //   orderBy,
  //   skip,
  //   take: limitNumber,
  // });

  return {
    // courses: courses.map(({ lessons, enrollments, ...rest }) => ({
    //   ...rest,
    //   lessonsCount: lessons.length,
    //   enrollmentsCount: enrollments.length,
    // })),
    totalPages: Math.ceil(totalCourses / limitNumber),
    currentPage: pageNumber,
    totalCourses,
  };
};

/**
 * @desc Get all courses of a specific author
 * @param authorId - Author user ID
 * @returns Array of courses with author, category, and lessons
 */
const getCoursesByAuthor = async (authorId: string) => {
  return prisma.course.findMany({
    where: { authorId, isDeleted: false }, // ✅ only active courses
    include: {
      // author: true,
      category: true,
      // lessons: true,
    },
  });
};

/**
 * @desc Update course by ID
 * @param id - Course ID
 * @param data - Partial course data
 * @returns Updated course object
 * @throws AppError if course not found or deleted
 */
const updateCourseById = async (id: string, data: ICourse) => {
  console.log("data1", data);
  const course = await prisma.course.findUnique({
    where: { id, isDeleted: false },
  });
  // if (!course) throw new AppError(404, "Course not found");

  // return prisma.course.update({ where: { id }, data });
};

/**
 * @desc Soft delete a course by ID (sets isDeleted = true)
 * @param authorId - Course author's ID
 * @param id - Course ID
 * @returns Updated course object
 * @throws AppError if not found, already deleted, or unauthorized
 */
const softDeleteCourseById = async (authorId: string, id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });

  if (!course || course.isDeleted) {
    throw new AppError(404, "Course not found");
  }

  if (course.authorId !== authorId) {
    throw new AppError(403, "You are not authorized to delete this course");
  }

  return prisma.course.update({
    where: { id },
    data: { isDeleted: true },
  });
};

/**
 * @desc Restore a soft-deleted course by ID
 * @param id - Course ID
 * @returns Updated course object
 * @throws AppError if course not found
 */
const restoreCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");

  return prisma.course.update({
    where: { id },
    data: { isDeleted: false },
  });
};

export const courseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  getCoursesByAuthor,
  updateCourseById,
  softDeleteCourseById,
  restoreCourseById,
  createCourseCategory
};
