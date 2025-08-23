import { prisma } from "../lib/prisma";

/**
 * @desc Create a new category
 * @param name - Name of the category
 * @returns Newly created category object
 * @throws Error if category already exists (and not soft-deleted)
 */
export const createCategory = async (name: string) => {
  const existing = await prisma.category.findFirst({
    where: { name, isDeleted: false },
  });

  if (existing) throw new Error("Category already exists");

  const category = await prisma.category.create({ data: { name } });
  return category;
};

/**
 * @desc Get all categories (excluding soft-deleted ones)
 * @returns Array of category objects
 */
export const getAllCategoriesInDb = async () => {
  const categories = await prisma.category.findMany({
    where: { isDeleted: false },
  });
  return categories;
};

/**
 * @desc Soft delete a category by ID (marks isDeleted = true)
 * @param id - Category ID
 * @returns Updated category object
 */
export const softDeleteCategory = async (id: string) => {
  const category = await prisma.category.update({
    where: { id },
    data: { isDeleted: true },
  });
  return category;
};

/**
 * @desc Restore a soft-deleted category by ID (marks isDeleted = false)
 * @param id - Category ID
 * @returns Updated category object
 */
export const restoreCategory = async (id: string) => {
  const category = await prisma.category.update({
    where: { id },
    data: { isDeleted: false },
  });
  return category;
};
