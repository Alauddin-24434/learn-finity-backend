import express from "express";
import { createCategoryHandler } from "./category.controller";

const router = express.Router();

router.post("/", createCategoryHandler); // POST /api/categories

export const categoryRoutes= router;
