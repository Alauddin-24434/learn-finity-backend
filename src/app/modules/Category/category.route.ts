import express from "express";
import { createCategoryHandler, getAllCategories } from "./category.controller";

const router = express.Router();

router.post("/", createCategoryHandler); // POST /api/categories
router.get("/", getAllCategories); // POST /api/categories

export const categoryRoutes= router;
