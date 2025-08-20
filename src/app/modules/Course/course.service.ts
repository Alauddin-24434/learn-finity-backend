// services/course.service.ts

import { AppError } from "../../error/AppError";
import { cloudinary } from "../../lib/cloudinary";
import { prisma } from "../../lib/prisma";
import { ICourse } from "./course.interface";

/**
 ===============================================================================
 * Create a new course
 ===============================================================================
 */
const createCourse = async (data: ICourse) => {
  let thumbnailPublicId = data.thumbnailPublicId;
  let overviewVideoPublicId = data.overviewVideoPublicId;

  // Check for duplicate course by the same author
  const exists = await prisma.course.findFirst({
    where: {
      title: data.title,
      authorId: data.authorId,
    },
  });
  if (exists) {
    throw new AppError(400, "Course with this title already exists for this author");
  }

  try {
    // Create course in DB
    return await prisma.course.create({
      data: {
        title: data.title,
        thumbnail: data.thumbnail,
        thumbnailPublicId:data.thumbnailPublicId,
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
  } catch (err) {
    // Rollback uploaded files if DB save fails
    if (thumbnailPublicId) {
      await cloudinary.uploader.destroy(thumbnailPublicId, { resource_type: "image" });
    }
    if (overviewVideoPublicId) {
      await cloudinary.uploader.destroy(overviewVideoPublicId, { resource_type: "video" });
    }
    throw err;
  }
};

/**
 =================================================================================================
 * Get a course by ID (with related data)
 ===================================================================================================
 */
const getCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({
    where: { id },
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: true, // we only need the counts
    },
  });

  if (!course) throw new AppError(404, "Course not found");

  // Destructure lessons and enrollments, keep the rest
  const { lessons, enrollments, ...rest } = course;

  return {
    ...rest,
    lessonsCount: lessons.length,
    enrollmentsCount: enrollments.length,
  };
};


/**
 ==================================================================================================
 * Get all courses with pagination, filtering, and sorting
 ========================================================================================================
 */
const getAllCourses = async (query: any) => {
  let { category, searchTerm, sort, page, limit } = query;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
  const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {};

  // Filter by category
  if (category) {
    where.category = {
      name: { contains: category, mode: "insensitive" },
    };
  }

  // Search by title or description
  if (searchTerm) {
    where.OR = [
      { title: { contains: searchTerm, mode: "insensitive" } },
      { description: { contains: searchTerm, mode: "insensitive" } },
    ];
  }

  // Sorting
  let orderBy = {};
  if (sort === "price-asc") orderBy = { price: "asc" };
  else if (sort === "price-desc") orderBy = { price: "desc" };
  else orderBy = { createdAt: "desc" };

  // Pagination count
  const totalCourses = await prisma.course.count({ where });

  // Fetch paginated data
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

  // Transform to only include counts for lessons & enrollments
  const coursesWithCounts = courses.map(({ lessons, enrollments, ...rest }) => ({
    ...rest,
    lessonsCount: lessons.length,
    enrollmentsCount: enrollments.length,
  }));

  return {
    courses: coursesWithCounts,
    totalPages: Math.ceil(totalCourses / limitNumber),
    currentPage: pageNumber,
    totalCourses,
  };
};


/**
 =============================================================================================================
 * Get courses of a specific author with earnings calculation
 ==============================================================================================================
 */
const getMyCourses = async (params: any) => {
  let { category, searchTerm, sort, page, limit, id } = params;

  page = parseInt(page, 10);
  limit = parseInt(limit, 10);

  const pageNumber = Number.isNaN(page) || page < 1 ? 1 : page;
  const limitNumber = Number.isNaN(limit) || limit < 1 ? 6 : limit;
  const skip = (pageNumber - 1) * limitNumber;

  const where: any = {};

  // Filter only by the logged-in author's courses
  if (id) where.authorId = id;

  if (category) {
    where.category = {
      name: { contains: category, mode: "insensitive" },
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

  const totalCourses = await prisma.course.count({ where });

  // Include only paid payments
  const coursesData = await prisma.course.findMany({
    where,
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: true,
      payments: {
        where: { status: "PAID" },
        select: { amount: true, status: true },
      },
    },
    orderBy,
    skip,
    take: limitNumber,
  });

  // Calculate total earnings for each course
  const courses = coursesData.map(course => ({
    ...course,
    totalEarn: course.payments.reduce((sum, payment) => sum + payment.amount, 0),
  }));

  return {
    courses,
    totalPages: Math.ceil(totalCourses / limitNumber),
    currentPage: pageNumber,
    totalCourses,
  };
};

/**
 ==========================================================================================================
 * Update course by ID
 ===========================================================================================================
 */
const updateCourseById = async (id: string, data: Partial<ICourse>) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.update({ where: { id }, data });
};

/**
 ===============================================================================================================
 * Soft delete course by ID
 ================================================================================================================
 */
const deleteCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.update({
    where: { id },
    data: { isDeleted: true },
  });
};

export const courseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  getMyCourses,
  updateCourseById,
  deleteCourseById,
};
