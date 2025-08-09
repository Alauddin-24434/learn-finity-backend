

// services/course.service.ts
import { AppError } from "../../error/AppError";
import { prisma } from "../../lib/prisma";
import { ICourse } from "./course.interface";

const createCourse = async (data: ICourse) => {
  const exists = await prisma.course.findFirst({
    where: { title: data.title },
  });
  if (exists) throw new AppError(400, "Course with this title already exists");
  return prisma.course.create({ data });
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

const getAllCourses = async () => {
  return prisma.course.findMany({
    where: {},
    include: {
      author: true,
      category: true,
      lessons: true,
      enrollments: true,
    },
  });
};

const updateCourseById = async (id: string, data: Partial<ICourse>) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.update({ where: { id }, data });
};

const deleteCourseById = async (id: string) => {
  const course = await prisma.course.findUnique({ where: { id } });
  if (!course) throw new AppError(404, "Course not found");
  return prisma.course.delete({ where: { id } });
};

export const courseService = {
  createCourse,
  getCourseById,
  getAllCourses,
  updateCourseById,
  deleteCourseById,
};
