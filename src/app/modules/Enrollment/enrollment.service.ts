// services/enrollment.service.ts

import { prisma } from "../../lib/prisma";
import { IEnrollment } from "./enrollment.interface";

export const createEnrollment = async (data: IEnrollment) => {
  return prisma.enrollment.create({ data });
};
