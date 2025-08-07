import { prisma } from "../../lib/prisma";
import { ICoupon } from "./coupon.interface";

export const createCoupon = async (data: ICoupon) => {
  const { courseIds, ...rest } = data;
  return prisma.coupon.create({
    data: {
      ...rest,
      courses: courseIds ? { connect: courseIds.map(id => ({ id })) } : undefined,
    },
  });
};
