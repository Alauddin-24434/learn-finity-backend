import { prisma } from "../../lib/prisma";

export const createCategory = async (name: string) => {
  // Check if category already exists
  const existing = await prisma.category.findUnique({ where: { name } });
  if (existing) {
    throw new Error("Category already exists");
  }

  // Create new category
  const category = await prisma.category.create({
    data: { name },
  });

  return category;
};
