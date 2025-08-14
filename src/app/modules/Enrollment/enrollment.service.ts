// services/enrollment.service.ts

import { prisma } from "../../lib/prisma";
import { IEnrollment } from "./enrollment.interface";

const createEnrollment = async (data: IEnrollment) => {
  return prisma.enrollment.create({ data });
};



export const enrollmetService= {
  createEnrollment
}