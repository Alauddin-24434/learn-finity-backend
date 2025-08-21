// routes/category.routes.ts
import express from "express";
import {
  createCategoryHandler,
  getAllCategories,
  softDeleteCategoryHandler,
  restoreCategoryHandler,
} from "./category.controller";
import { authenticate } from "../../middleware/authenticate";

const router = express.Router();

/**
 * @swagger
 * tags:
 *   name: Categories
 *   description: APIs to manage course categories
 */

/**
 * @swagger
 * /api/categories:
 *   post:
 *     summary: Create a new category
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 */
router.post("/", authenticate, createCategoryHandler);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 */
router.get("/", getAllCategories);

/**
 * @swagger
 * /api/categories/{id}/delete:
 *   patch:
 *     summary: Soft-delete a category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 */
router.patch("/:id/delete", authenticate, softDeleteCategoryHandler);

/**
 * @swagger
 * /api/categories/{id}/restore:
 *   patch:
 *     summary: Restore a soft-deleted category by ID
 *     tags: [Categories]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         description: Category ID
 *         schema:
 *           type: string
 */
router.patch("/:id/restore", authenticate, restoreCategoryHandler);

export const categoryRoutes = router;
