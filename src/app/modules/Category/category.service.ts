import { prisma } from "../../lib/prisma";

// Create a new category
export const createCategory = async (name: string) => {
  // Check if category already exists and not soft-deleted
  const existing = await prisma.category.findFirst({
    where: { name, isDeleted: false },
  });

  if (existing) {
    throw new Error("Category already exists");
  }

  const category = await prisma.category.create({
    data: { name },
  });

  return category;
};

// Get all categories (only not soft-deleted)
export const getAllCategoriesInDb = async () => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
  });

  return categories;
};

// Soft delete a category
export const softDeleteCategory = async (id: string) => {
  const category = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });

  return category;
};

// Restore a soft-deleted category
export const restoreCategory = async (id: string) => {
  const category = await prisma.category.update({
    where: { id },
    data: { isDeleted: false },
  });

  return category;
};
