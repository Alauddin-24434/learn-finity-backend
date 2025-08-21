// services/enrollment.service.ts
import { prisma } from "../../lib/prisma";
import { IEnrollment } from "./enrollment.interface";

const createEnrollment = async (data: IEnrollment) => {
  return prisma.enrollment.create({ data });
};

const getEnrollmentsByUserId = async (userId: string) => {
  return prisma.enrollment.findMany({
    where: { userId },
    include: { course: true }, // include course details if needed
  });
};

export const enrollmentService = {
  createEnrollment,
  getEnrollmentsByUserId,
};
