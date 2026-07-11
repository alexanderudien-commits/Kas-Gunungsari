// =====================
// Type definitions
// =====================

export interface User {
  id: string;
  name: string;
  email: string;
  password: string;
  createdAt: string;
}

export type TransactionType = 'income' | 'expense';

export interface Transaction {
  id: string;
  type: TransactionType;
  category: string;
  description: string;
  amount: number;
  date: string;
  createdAt: string;
}

export interface CustomCategory {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
}

export interface Budget {
  id: string;
  category: string;
  limit: number;
  period: 'monthly' | 'weekly';
}

export const DEFAULT_CATEGORIES: Record<TransactionType, string[]> = {
  income: [
    'Tiket Masuk',
    'Souvenir',
    'Penjualan Suvenir',
    'Iuran Air',
    'Sumbangan Warga',
    'Donasi',
    'Penginapan',
    'Parkir',
    'Lain-lain',
  ],
  expense: [
    'Operasional',
    'Perbaikan Fasilitas',
    'Bayar Listrik',
    'Bayar Air',
    'Perbaikan Pipa',
    'Gaji Karyawan',
    'Transportasi',
    'Perlengkapan',
    'Lain-lain',
  ],
};

export const CATEGORY_ICONS: Record<string, string> = {
  'Tiket Masuk': 'Ticket',
  'Souvenir': 'ShoppingBag',
  'Penjualan Suvenir': 'ShoppingCart',
  'Iuran Air': 'Droplet',
  'Sumbangan Warga': 'HeartHandshake',
  'Donasi': 'Heart',
  'Penginapan': 'Home',
  'Parkir': 'Car',
  'Operasional': 'Wrench',
  'Perbaikan Fasilitas': 'Wrench',
  'Bayar Listrik': 'Zap',
  'Bayar Air': 'Droplet',
  'Perbaikan Pipa': 'Wrench',
  'Gaji Karyawan': 'Users',
  'Transportasi': 'Truck',
  'Perlengkapan': 'Package',
  'Lain-lain': 'MoreHorizontal',
};

export const AVAILABLE_ICONS = [
  'Ticket', 'ShoppingBag', 'ShoppingCart', 'Droplet', 'HeartHandshake',
  'Heart', 'Home', 'Car', 'Wrench', 'Zap', 'Users', 'Truck',
  'Package', 'MoreHorizontal', 'Coffee', 'Utensils', 'Landmark',
  'Leaf', 'Star', 'Gift', 'BookOpen', 'Briefcase', 'Smartphone',
  'Wifi', 'Fuel', 'Pill', 'Stethoscope', 'GraduationCap',
];
