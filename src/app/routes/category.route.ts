import express from "express";
import {
  createCategoryHandler,
  getAllCategories,
  softDeleteCategoryHandler,
  restoreCategoryHandler,
} from "../controllers/category.controller";
import { authenticate } from "../middleware/authenticate";

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
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             properties:
 *               name:
 *                 type: string
 *     responses:
 *       201: { description: Category created successfully }
 *       400: { description: Validation error or category exists }
 */
// Create a new category (private)
router.post("/", authenticate, createCategoryHandler);

/**
 * @swagger
 * /api/categories:
 *   get:
 *     summary: Get all categories
 *     tags: [Categories]
 *     responses:
 *       200: { description: List of categories }
 */
// Get all categories (public)
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
 *     responses:
 *       200: { description: Category soft-deleted successfully }
 *       404: { description: Category not found }
 */
// Soft-delete a category (private)
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
 *     responses:
 *       200: { description: Category restored successfully }
 *       404: { description: Category not found }
 */
// Restore a soft-deleted category (private)
router.patch("/:id/restore", authenticate, restoreCategoryHandler);

export const categoryRoutes = router; // Export category router
