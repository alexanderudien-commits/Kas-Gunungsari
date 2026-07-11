import { eq, and } from "drizzle-orm";
import { db } from "../config/db";
import { budgets } from "../db/schema";

export class BudgetService {
  static async getAll(userId: string) {
    return db
      .select()
      .from(budgets)
      .where(eq(budgets.userId, userId));
  }

  static async create(userId: string, data: { category: string; limit: number; period: 'monthly' | 'weekly' }) {
    const [newBudget] = await db
      .insert(budgets)
      .values({
        userId,
        ...data,
      })
      .returning();
    return newBudget;
  }

  static async update(userId: string, budgetId: string, data: Partial<{ category: string; limit: number; period: 'monthly' | 'weekly' }>) {
    const [updatedBudget] = await db
      .update(budgets)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, userId)))
      .returning();
    return updatedBudget;
  }

  static async delete(userId: string, budgetId: string) {
    const [deletedBudget] = await db
      .delete(budgets)
      .where(and(eq(budgets.id, budgetId), eq(budgets.userId, userId)))
      .returning();
    return deletedBudget;
  }
}
