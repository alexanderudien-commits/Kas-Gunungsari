import { eq, desc, and, gte, lte } from "drizzle-orm";
import { db } from "../config/db";
import { transactions } from "../db/schema";

export class TransactionService {
  static async getAll(userId: string) {
    return db
      .select()
      .from(transactions)
      .where(eq(transactions.userId, userId))
      .orderBy(desc(transactions.date));
  }

  static async create(userId: string, data: { type: 'income' | 'expense'; category: string; description: string; amount: number; date: Date }) {
    const [newTransaction] = await db
      .insert(transactions)
      .values({
        userId,
        ...data,
      })
      .returning();
    return newTransaction;
  }

  static async update(userId: string, transactionId: string, data: Partial<{ type: 'income' | 'expense'; category: string; description: string; amount: number; date: Date }>) {
    const [updatedTransaction] = await db
      .update(transactions)
      .set({ ...data, updatedAt: new Date() })
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
      .returning();
    return updatedTransaction;
  }

  static async delete(userId: string, transactionId: string) {
    const [deletedTransaction] = await db
      .delete(transactions)
      .where(and(eq(transactions.id, transactionId), eq(transactions.userId, userId)))
      .returning();
    return deletedTransaction;
  }
}
