import { eq, and } from "drizzle-orm";
import { db } from '../config/db.js';
import { customCategories } from '../db/schema.js';

export class CategoryService {
  static async getAll(userId: string) {
    return db
      .select()
      .from(customCategories)
      .where(eq(customCategories.userId, userId));
  }

  static async create(userId: string, data: { name: string; type: 'income' | 'expense'; icon: string }) {
    const [newCat] = await db
      .insert(customCategories)
      .values({
        userId,
        ...data,
      })
      .returning();
    return newCat;
  }

  static async delete(userId: string, categoryId: string) {
    const [deletedCat] = await db
      .delete(customCategories)
      .where(and(eq(customCategories.id, categoryId), eq(customCategories.userId, userId)))
      .returning();
    return deletedCat;
  }
}
