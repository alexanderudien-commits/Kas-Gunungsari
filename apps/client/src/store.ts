import { api } from './lib/api';
import { authClient, signIn, signUp, signOut } from './lib/auth-client';
import { User, Transaction, CustomCategory, Budget, DEFAULT_CATEGORIES, CATEGORY_ICONS } from './types';

// =====================
// Auth
// =====================

export async function requestPasswordReset(email: string): Promise<{ ok: true } | { ok: false; error: string }> {
  try {
    const res = await authClient.forgetPassword({ email, redirectTo: `${window.location.origin}/reset-password` });
    if (res.error) {
      return { ok: false, error: res.error.message || 'Gagal mengirim email reset' };
    }
    return { ok: true };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Gagal mengirim email reset' };
  }
}

export async function registerUser(name: string, email: string, password: string): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const res = await signUp.email({ email, password, name, callbackURL: `${window.location.origin}/` });
    if (res.error) {
      return { ok: false, error: res.error.message || 'Gagal mendaftar' };
    }
    const sessionRes = await authClient.getSession();
    return { ok: true, user: sessionRes.data?.user as unknown as User };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Gagal mendaftar' };
  }
}

export async function loginUser(email: string, password: string): Promise<{ ok: true; user: User } | { ok: false; error: string }> {
  try {
    const res = await signIn.email({ email, password });
    if (res.error) {
      return { ok: false, error: res.error.message || 'Email atau password salah' };
    }
    const sessionRes = await authClient.getSession();
    return { ok: true, user: sessionRes.data?.user as unknown as User };
  } catch (error: any) {
    return { ok: false, error: error.message || 'Email atau password salah' };
  }
}

export async function getCurrentUser(): Promise<User | null> {
  try {
    const res = await authClient.getSession();
    return res.data?.user as unknown as User || null;
  } catch (e) {
    return null;
  }
}

export async function logoutUser(): Promise<void> {
  await signOut();
}

export async function updateUserProfile(_userId: string, _updates: Partial<Pick<User, 'name' | 'email'>>): Promise<User | null> {
  // TODO: better-auth might have profile update endpoint, 
  // or we can just return the current user for now
  const res = await authClient.getSession();
  return res.data?.user as unknown as User || null;
}

// =====================
// Transactions
// =====================

export async function getTransactions(): Promise<Transaction[]> {
  try {
    const res = await api.get('/transactions');
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function addTransaction(tx: Omit<Transaction, 'id' | 'createdAt'>): Promise<Transaction> {
  const res = await api.post('/transactions', tx);
  return res.data;
}

export async function deleteTransaction(txId: string): Promise<void> {
  await api.delete(`/transactions/${txId}`);
}

export async function updateTransaction(txId: string, updates: Partial<Omit<Transaction, 'id' | 'createdAt'>>): Promise<Transaction | null> {
  const res = await api.put(`/transactions/${txId}`, updates);
  return res.data;
}

// =====================
// Custom Categories
// =====================

export async function getCustomCategories(): Promise<CustomCategory[]> {
  try {
    const res = await api.get('/categories');
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function addCustomCategory(cat: Omit<CustomCategory, 'id'>): Promise<CustomCategory> {
  const res = await api.post('/categories', cat);
  return res.data;
}

export async function deleteCustomCategory(catId: string): Promise<void> {
  await api.delete(`/categories/${catId}`);
}

// =====================
// Budgets
// =====================

export async function getBudgets(): Promise<Budget[]> {
  try {
    const res = await api.get('/budgets');
    return res.data;
  } catch (e) {
    return [];
  }
}

export async function addBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
  const res = await api.post('/budgets', budget);
  return res.data;
}

export async function deleteBudget(budgetId: string): Promise<void> {
  await api.delete(`/budgets/${budgetId}`);
}

export async function updateBudget(budgetId: string, updates: Partial<Omit<Budget, 'id'>>): Promise<Budget | null> {
  const res = await api.put(`/budgets/${budgetId}`, updates);
  return res.data;
}

// =====================
// Helper functions (Synchronous)
// =====================

export function getAllCategories(customCategories: CustomCategory[]): Record<'income' | 'expense', string[]> {
  const incomeCustom = customCategories.filter(c => c.type === 'income').map(c => c.name);
  const expenseCustom = customCategories.filter(c => c.type === 'expense').map(c => c.name);
  return {
    income: [...DEFAULT_CATEGORIES.income, ...incomeCustom],
    expense: [...DEFAULT_CATEGORIES.expense, ...expenseCustom],
  };
}

export function getCategoryIcon(customCategories: CustomCategory[], categoryName: string): string {
  const found = customCategories.find(c => c.name === categoryName);
  if (found) return found.icon;
  return CATEGORY_ICONS[categoryName] || 'MoreHorizontal';
}

export async function seedDemoData(): Promise<void> {
  // Not used anymore for backend
}
