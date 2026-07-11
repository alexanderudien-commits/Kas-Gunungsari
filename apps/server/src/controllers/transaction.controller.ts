import { Request, Response } from "express";
import { TransactionService } from "../services/transaction.service";

export class TransactionController {
  static async getAll(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const data = await TransactionService.getAll(userId);
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to fetch transactions" });
    }
  }

  static async create(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { type, category, description, amount, date } = req.body;
      const data = await TransactionService.create(userId, { type, category, description, amount, date: new Date(date) });
      res.status(201).json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to create transaction" });
    }
  }

  static async update(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const updates = req.body;
      if (updates.date) updates.date = new Date(updates.date);
      const data = await TransactionService.update(userId, id, updates);
      if (!data) return res.status(404).json({ error: "Transaction not found" });
      res.json(data);
    } catch (error) {
      res.status(500).json({ error: "Failed to update transaction" });
    }
  }

  static async delete(req: Request, res: Response) {
    try {
      const userId = (req as any).user.id;
      const { id } = req.params;
      const data = await TransactionService.delete(userId, id);
      if (!data) return res.status(404).json({ error: "Transaction not found" });
      res.json({ success: true, id });
    } catch (error) {
      res.status(500).json({ error: "Failed to delete transaction" });
    }
  }
}
