import { Request, Response } from "express";
import { createCategory } from "./category.service";

export const createCategoryHandler = async (req: Request, res: Response) => {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({ message: "Category name is required" });
    }

    const category = await createCategory(name);
    return res.status(201).json({ success: true, data: category });
  } catch (error: any) {
    return res.status(400).json({ success: false, message: error.message });
  }
};
