// Entidades principais do sistema
export interface User {
  id: string;
  name: string;
  email: string;
  role: 'admin' | 'user';
  createdAt: Date;
}

export interface Product {
  id: string;
  name: string;
  description: string;
  categoryId: string;
  category?: Category;
  cost: number;
  price: number;
  stock: number;
  minStock: number;
  imageUrl?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface Category {
  id: string;
  name: string;
  description?: string;
  createdAt: Date;
}

export interface Client {
  id: string;
  name: string;
  email?: string;
  phone?: string;
  address?: string;
  creditLimit: number;
  currentDebt: number;
  createdAt: Date;
}

export interface Sale {
  id: string;
  clientId: string;
  client?: Client;
  items: SaleItem[];
  subtotal: number;
  discount: number;
  total: number;
  paymentMethod: 'cash' | 'card' | 'credit' | 'pix';
  status: 'completed' | 'pending' | 'cancelled';
  createdAt: Date;
}

export interface SaleItem {
  id: string;
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

export interface AccountReceivable {
  id: string;
  clientId: string;
  client?: Client;
  saleId?: string;
  description: string;
  amount: number;
  dueDate: Date;
  paidAt?: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
}

export interface AccountPayable {
  id: string;
  description: string;
  amount: number;
  dueDate: Date;
  category: string;
  paidAt?: Date;
  status: 'pending' | 'paid' | 'overdue';
  createdAt: Date;
}

// Dashboard metrics
export interface DashboardMetrics {
  totalSales: number;
  totalRevenue: number;
  totalExpenses: number;
  totalCredit: number;
  lowStockProducts: number;
  monthlySales: MonthlySale[];
}

export interface MonthlySale {
  month: string;
  amount: number;
}

// Form types
export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
}

// API Response types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

// Filter types
export interface ProductFilters {
  search?: string;
  categoryId?: string;
  minPrice?: number;
  maxPrice?: number;
  lowStock?: boolean;
}

export interface SaleFilters {
  clientId?: string;
  status?: Sale['status'];
  paymentMethod?: Sale['paymentMethod'];
  startDate?: Date;
  endDate?: Date;
}

export interface AccountFilters {
  clientId?: string;
  status?: 'pending' | 'paid' | 'overdue';
  startDate?: Date;
  endDate?: Date;
}
