import { AppError } from "../../error/AppError";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { ICourse } from "./course.interface";

/**
 * Create a new course
 */
const createCourse = async (data: ICourse) => {
  const exists = await prisma.course.findFirst({
    where: {
      title: data.title,
      authorId: data.authorId,
    },
  });
  if (exists) {
    throw new AppError(400, "Course with this title already exists for this author");
  }

  let thumbnailPublicId = data.thumbnailPublicId;
  let overviewVideoPublicId = data.overviewVideoPublicId;

  
    return await prisma.course.create({
      data: {
        title: data.title,
        thumbnail: data.thumbnail,
        thumbnailPublicId,
        overviewVideo: data.overviewVideo,
        overviewVideoPublicId,
        price: Number(data.price),
        isFree: Boolean(data.isFree),
        description: data.description,
        authorId: data.authorId,
        categoryId: data.categoryId,
        features: data.features,
        stack: data.stack,
        overviews: data.overviews,
      },
    });

};

/**
 * Get course by ID (with related data)
 */
const getCourseById = async (id: string, userId: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: { where: { userId }, select: { id: true } },
    },
  });
  if (!course || course.isDeleted) throw new AppError(404, "Course not found");

  const { lessons, enrollments, ...rest } = course;
  return {
    ...rest,
    lessonsCount: lessons.length,
    enrollmentsCount: await prisma.enrollment.count({ where: { courseId: id } }),
    isEnrolled: enrollments.length > 0,
  };
};

/**
 * Get all courses (non-deleted only)
 */
const getAllCourses = async (query: any) => {
  let { category, searchTerm, sort, page, limit } = query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
  const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = { isDeleted: false };

  if (category) where.category = { name: { contains: category, mode: "insensitive" } };
  if (searchTerm) where.OR = [
    { title: { contains: searchTerm, mode: "insensitive" } },
    { description: { contains: searchTerm, mode: "insensitive" } },
  ];

  let orderBy = {};
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else orderBy = { createdAt: "desc" };

  const totalCourses = await prisma.course.count({ where });

  const courses = await prisma.course.findMany({
    where,
    include: { author: true, category: true, lessons: true, enrollments: true },
    orderBy,
    skip,
    take: limitNumber,
  });

  return {
    courses: courses.map(({ lessons, enrollments, ...rest }) => ({
      ...rest,
      lessonsCount: lessons.length,
      enrollmentsCount: enrollments.length,
    })),
    totalPages: Math.ceil(totalCourses / limitNumber),
    currentPage: pageNumber,
    totalCourses,
  };
};

 const getCoursesByAuthor=async (authorId: string) => {
    const courses = await prisma.course.findMany({
      where: { authorId },
      include: {
        author: true,
        category: true,
        lessons: true,
      },
    });

    return courses;
  }



/**
 * Update course by ID
 */
const updateCourseById = async (id: string, data: Partial<ICourse>) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course || course.isDeleted) throw new AppError(404, "Course not found");
  return prisma.course.update({ where: { id }, data });
};

/**
 * Soft delete course by ID
 */
const softDeleteCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course || course.isDeleted) throw new AppError(404, "Course not found");
  return prisma.course.update({ where: { id }, data: { isDeleted: true } });
};

/**
 * Restore soft-deleted course by ID
 */
const restoreCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.update({ where: { id }, data: { isDeleted: false } });
};

export const courseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  softDeleteCourseById,
  restoreCourseById,
  getCoursesByAuthor
};
