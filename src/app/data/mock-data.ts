import { Product, Category, Client, Sale, AccountReceivable, AccountPayable, DashboardMetrics } from '../models';

// Mock Categories
export const mockCategories: Category[] = [
  { id: '1', name: 'Bebidas', description: 'Refrigerantes, sucos, águas', createdAt: new Date('2024-01-01') },
  { id: '2', name: 'Alimentos', description: 'Salgadinhos, doces, bolachas', createdAt: new Date('2024-01-01') },
  { id: '3', name: 'Limpeza', description: 'Produtos de limpeza', createdAt: new Date('2024-01-01') },
  { id: '4', name: 'Higiene', description: 'Produtos de higiene pessoal', createdAt: new Date('2024-01-01') },
  { id: '5', name: 'Frios', description: 'Queijos, presuntos, frios em geral', createdAt: new Date('2024-01-01') },
];

// Mock Products
export const mockProducts: Product[] = [
  {
    id: '1',
    name: 'Coca-Cola 2L',
    description: 'Refrigerante de cola',
    categoryId: '1',
    cost: 4.50,
    price: 8.99,
    stock: 45,
    minStock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1559302995-f1d8642c6806?w=300',
    createdAt: new Date('2024-01-01'),
    updatedAt: new Date('2024-01-15')
  },
  {
    id: '2',
    name: 'Doritos 140g',
    description: 'Salgadinho de milho sabor queijo',
    categoryId: '2',
    cost: 3.20,
    price: 6.99,
    stock: 8,
    minStock: 15,
    imageUrl: 'https://images.unsplash.com/photo-1585672077161-1b3b4b5c1a0a?w=300',
    createdAt: new Date('2024-01-02'),
    updatedAt: new Date('2024-01-16')
  },
  {
    id: '3',
    name: 'Sabão em Pó OMO 1kg',
    description: 'Sabão em pó para roupas',
    categoryId: '3',
    cost: 12.00,
    price: 18.99,
    stock: 25,
    minStock: 5,
    imageUrl: 'https://images.unsplash.com/photo-1585386959984-a4155224a1ad?w=300',
    createdAt: new Date('2024-01-03'),
    updatedAt: new Date('2024-01-17')
  },
  {
    id: '4',
    name: 'Shampoo Clear 400ml',
    description: 'Shampoo anticaspa',
    categoryId: '4',
    cost: 8.50,
    price: 14.99,
    stock: 30,
    minStock: 8,
    imageUrl: 'https://images.unsplash.com/photo-1522337360788-8b13dee7a37e?w=300',
    createdAt: new Date('2024-01-04'),
    updatedAt: new Date('2024-01-18')
  },
  {
    id: '5',
    name: 'Presunto Sadia 200g',
    description: 'Presunto cozido fatiado',
    categoryId: '5',
    cost: 7.00,
    price: 12.99,
    stock: 15,
    minStock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1544947950-fa07a98d237f?w=300',
    createdAt: new Date('2024-01-05'),
    updatedAt: new Date('2024-01-19')
  },
  {
    id: '6',
    name: 'Guaraná Antarctica 2L',
    description: 'Refrigerante de guaraná',
    categoryId: '1',
    cost: 4.20,
    price: 7.99,
    stock: 50,
    minStock: 10,
    imageUrl: 'https://images.unsplash.com/photo-1603833777053-a5397a278a5a?w=300',
    createdAt: new Date('2024-01-06'),
    updatedAt: new Date('2024-01-20')
  },
  {
    id: '7',
    name: 'Salgadinhos Elma Chips 100g',
    description: 'Mix de salgadinhos',
    categoryId: '2',
    cost: 2.80,
    price: 5.49,
    stock: 3,
    minStock: 12,
    imageUrl: 'https://images.unsplash.com/photo-1571091718767-18b5b145aadd?w=300',
    createdAt: new Date('2024-01-07'),
    updatedAt: new Date('2024-01-21')
  },
  {
    id: '8',
    name: 'Detergente Ypê 500ml',
    description: 'Detergente líquido',
    categoryId: '3',
    cost: 1.50,
    price: 3.29,
    stock: 60,
    minStock: 20,
    imageUrl: 'https://images.unsplash.com/photo-1584212261402-3a5bcf1f5d6b?w=300',
    createdAt: new Date('2024-01-08'),
    updatedAt: new Date('2024-01-22')
  }
];

// Mock Clients
export const mockClients: Client[] = [
  {
    id: '1',
    name: 'João Silva',
    email: 'joao@email.com',
    phone: '(11) 98765-4321',
    address: 'Rua das Flores, 123 - São Paulo/SP',
    creditLimit: 500.00,
    currentDebt: 150.00,
    createdAt: new Date('2024-01-01')
  },
  {
    id: '2',
    name: 'Maria Santos',
    email: 'maria@email.com',
    phone: '(11) 91234-5678',
    address: 'Av. Principal, 456 - São Paulo/SP',
    creditLimit: 300.00,
    currentDebt: 0.00,
    createdAt: new Date('2024-01-02')
  },
  {
    id: '3',
    name: 'Carlos Oliveira',
    email: 'carlos@email.com',
    phone: '(11) 92345-6789',
    address: 'Rua Verde, 789 - São Paulo/SP',
    creditLimit: 1000.00,
    currentDebt: 450.00,
    createdAt: new Date('2024-01-03')
  },
  {
    id: '4',
    name: 'Ana Costa',
    email: 'ana@email.com',
    phone: '(11) 93456-7890',
    address: 'Alameda dos Anjos, 321 - São Paulo/SP',
    creditLimit: 200.00,
    currentDebt: 50.00,
    createdAt: new Date('2024-01-04')
  },
  {
    id: '5',
    name: 'Pedro Martins',
    email: 'pedro@email.com',
    phone: '(11) 94567-8901',
    address: 'Praça Central, 654 - São Paulo/SP',
    creditLimit: 800.00,
    currentDebt: 0.00,
    createdAt: new Date('2024-01-05')
  }
];

// Mock Sales
export const mockSales: Sale[] = [
  {
    id: '1',
    clientId: '1',
    items: [
      {
        id: '1',
        productId: '1',
        quantity: 2,
        unitPrice: 8.99,
        subtotal: 17.98
      },
      {
        id: '2',
        productId: '2',
        quantity: 1,
        unitPrice: 6.99,
        subtotal: 6.99
      }
    ],
    subtotal: 24.97,
    discount: 2.00,
    total: 22.97,
    paymentMethod: 'cash',
    status: 'completed',
    createdAt: new Date('2024-01-15T10:30:00')
  },
  {
    id: '2',
    clientId: '2',
    items: [
      {
        id: '3',
        productId: '3',
        quantity: 1,
        unitPrice: 18.99,
        subtotal: 18.99
      },
      {
        id: '4',
        productId: '4',
        quantity: 2,
        unitPrice: 14.99,
        subtotal: 29.98
      }
    ],
    subtotal: 48.97,
    discount: 0.00,
    total: 48.97,
    paymentMethod: 'card',
    status: 'completed',
    createdAt: new Date('2024-01-15T14:20:00')
  },
  {
    id: '3',
    clientId: '1',
    items: [
      {
        id: '5',
        productId: '5',
        quantity: 3,
        unitPrice: 12.99,
        subtotal: 38.97
      }
    ],
    subtotal: 38.97,
    discount: 5.00,
    total: 33.97,
    paymentMethod: 'credit',
    status: 'pending',
    createdAt: new Date('2024-01-16T09:15:00')
  }
];

// Mock Accounts Receivable
export const mockAccountsReceivable: AccountReceivable[] = [
  {
    id: '1',
    clientId: '1',
    saleId: '3',
    description: 'Venda #3 - Produtos diversos',
    amount: 33.97,
    dueDate: new Date('2024-02-15'),
    status: 'pending',
    createdAt: new Date('2024-01-16')
  },
  {
    id: '2',
    clientId: '3',
    description: 'Fiado - Compras do mês',
    amount: 450.00,
    dueDate: new Date('2024-02-01'),
    status: 'overdue',
    createdAt: new Date('2024-01-01')
  },
  {
    id: '3',
    clientId: '4',
    description: 'Fiado - Bebidas',
    amount: 50.00,
    dueDate: new Date('2024-01-30'),
    status: 'pending',
    createdAt: new Date('2024-01-15')
  }
];

// Mock Accounts Payable
export const mockAccountsPayable: AccountPayable[] = [
  {
    id: '1',
    description: 'Aluguel do comércio',
    amount: 1500.00,
    dueDate: new Date('2024-02-05'),
    category: 'Aluguel',
    status: 'pending',
    createdAt: new Date('2024-01-05')
  },
  {
    id: '2',
    description: 'Conta de luz',
    amount: 280.00,
    dueDate: new Date('2024-01-25'),
    category: 'Energia',
    status: 'paid',
    paidAt: new Date('2024-01-20'),
    createdAt: new Date('2024-01-10')
  },
  {
    id: '3',
    description: 'Internet',
    amount: 120.00,
    dueDate: new Date('2024-02-10'),
    category: 'Telecomunicações',
    status: 'pending',
    createdAt: new Date('2024-01-12')
  },
  {
    id: '4',
    description: 'Água e esgoto',
    amount: 95.00,
    dueDate: new Date('2024-01-28'),
    category: 'Água',
    status: 'pending',
    createdAt: new Date('2024-01-08')
  }
];

// Mock Dashboard Metrics
export const mockDashboardMetrics: DashboardMetrics = {
  totalSales: 156,
  totalRevenue: 15450.50,
  totalExpenses: 3250.00,
  totalCredit: 533.97,
  lowStockProducts: 2,
  monthlySales: [
    { month: 'Jan', amount: 3200.00 },
    { month: 'Fev', amount: 3800.00 },
    { month: 'Mar', amount: 4100.00 },
    { month: 'Abr', amount: 3600.00 },
    { month: 'Mai', amount: 4250.00 },
    { month: 'Jun', amount: 4500.00 }
  ]
};
