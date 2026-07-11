import { Request, Response } from "express";
import { CategoryService } from "../services/category.service";

export class CategoryController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await CategoryService.getAll(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch categories" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { name, type, icon } = req.body;
      const data = await CategoryService.create(userId, { name, type, icon });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to create category" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data = await CategoryService.delete(userId, id as string);
      if (!data) return res.status(404).json({ error: "Category not found" });
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete category" });
    }
  }
}
