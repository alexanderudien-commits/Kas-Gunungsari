import { Request, Response } from "express";
import { BudgetService } from '../services/budget.service.js';

export class BudgetController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await BudgetService.getAll(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch budgets" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { category, limit, period } = req.body;
      const data = await BudgetService.create(userId, { category, limit, period });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to create budget" });
    }
  }

  static async update(req: Request, res: Response) {
    const userId = req.headers["x-user-id"] as string;
    if (!userId) return res.status(401).json({ error: "Unauthorized" });

    try {
      const data = await BudgetService.update(userId, req.params.id as string, req.body);
      if (!data) return res.status(404).json({ error: "Budget not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update budget" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data = await BudgetService.delete(userId, id as string);
      if (!data) return res.status(404).json({ error: "Budget not found" });
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete budget" });
    }
  }
}
