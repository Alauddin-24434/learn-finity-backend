import { Request, Response } from "express";
import {
  createCategory,
  getAllCategoriesInDb,
  softDeleteCategory,
  restoreCategory,
} from "../services/category.service";
import { catchAsyncHandler } from "../utils/catchAsyncHandler";
import { sendResponse } from "../utils/sendResponse";

// Create a new category
export const createCategoryHandler = catchAsyncHandler(async (req: Request, res: Response) => {
  const { name } = req.body;
  if (!name) {
    return res.status(400).json({ success: false, message: "Category name is required" });
  }

  const category = await createCategory(name);

  return sendResponse(res, {
    statusCode: 201,
    success: true,
    message: "Category created successfully",
    data: category,
  });
});

// Get all categories (excluding soft-deleted)
export const getAllCategories = catchAsyncHandler(async (req: Request, res: Response) => {
  const categories = await getAllCategoriesInDb();

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Categories retrieved successfully",
    data: categories,
  });
});

// Soft delete a category
export const softDeleteCategoryHandler = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await softDeleteCategory(id);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category soft-deleted successfully",
    data: category,
  });
});

// Restore a soft-deleted category
export const restoreCategoryHandler = catchAsyncHandler(async (req: Request, res: Response) => {
  const { id } = req.params;

  const category = await restoreCategory(id);

  return sendResponse(res, {
    statusCode: 200,
    success: true,
    message: "Category restored successfully",
    data: category,
  });
});
