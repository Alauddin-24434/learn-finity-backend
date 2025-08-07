import { prisma } from "../../lib/prisma";
import { ICouponUsage } from "./couponUsage.interface";

export const createCouponUsage = async (data: ICouponUsage) => {
  return prisma.couponUsage.create({ data });
};
