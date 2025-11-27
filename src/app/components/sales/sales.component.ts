import { Component, OnInit } from '@angular/core';
import { SaleService } from '../../services/sale.service';
import { ClientService } from '../../services/client.service';
import { ProductService } from '../../services/product.service';
import { Sale, Client, Product, SaleItem } from '../../models';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {
  sales: Sale[] = [];
  displayedColumns: string[] = ['id', 'client', 'items', 'total', 'paymentMethod', 'status', 'date', 'actions'];
  loading = true;

  // Nova Venda
  showNewSaleDialog = false;
  clients: Client[] = [];
  products: Product[] = [];
  selectedClient: string = '';
  cart: CartItem[] = [];
  discount: number = 0;
  paymentMethod: 'cash' | 'card' | 'credit' | 'pix' = 'cash';
  formError: string = '';

  constructor(
    private saleService: SaleService,
    private clientService: ClientService,
    private productService: ProductService,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSales();
    this.loadClients();
    this.loadProducts();
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      }
    });
  }

  loadProducts(): void {
    this.productService.getAll().subscribe({
      next: (products) => {
        this.products = products;
      }
    });
  }

  loadSales(): void {
    this.loading = true;
    this.saleService.getAll().subscribe({
      next: (sales) => {
        this.sales = sales;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar vendas:', err);
        this.loading = false;
      }
    });
  }

  deleteSale(id: string): void {
    const sale = this.sales.find(s => s.id === id);
    if (!sale) return;

    this.confirmationService.confirmDelete(`Venda #${sale.id}`, 'venda').subscribe(confirmed => {
      if (confirmed) {
        this.saleService.delete(id).subscribe({
          next: () => {
            this.loadSales();
          }
        });
      }
    });
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'cash': 'Dinheiro',
      'card': 'Cartão',
      'credit': 'Crédito',
      'pix': 'PIX'
    };
    return labels[method] || method;
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'completed': 'Concluída',
      'pending': 'Pendente',
      'cancelled': 'Cancelada'
    };
    return labels[status] || status;
  }

  // Nova Venda
  openNewSaleDialog(): void {
    this.showNewSaleDialog = true;
    this.resetForm();
  }

  closeNewSaleDialog(): void {
    this.showNewSaleDialog = false;
    this.resetForm();
  }

  resetForm(): void {
    this.selectedClient = '';
    this.cart = [];
    this.discount = 0;
    this.paymentMethod = 'cash';
    this.formError = '';
  }

  addToCart(product: Product): void {
    // Verifica estoque
    if (product.stock === 0) {
      this.formError = 'Produto sem estoque disponível';
      return;
    }

    // Verifica se já existe no carrinho
    const existingItem = this.cart.find(item => item.productId === product.id);
    
    if (existingItem) {
      // Verifica se há estoque suficiente
      if (existingItem.quantity >= product.stock) {
        this.formError = `Estoque insuficiente. Disponível: ${product.stock}`;
        return;
      }
      existingItem.quantity++;
      existingItem.subtotal = existingItem.quantity * existingItem.unitPrice;
    } else {
      this.cart.push({
        productId: product.id,
        product: product,
        quantity: 1,
        unitPrice: product.price,
        subtotal: product.price
      });
    }

    this.formError = '';
  }

  removeFromCart(index: number): void {
    this.cart.splice(index, 1);
  }

  updateQuantity(productId: string, quantity: number): void {
    const item = this.cart.find(i => i.productId === productId);
    if (!item) return;

    // Remove item se quantidade for 0 ou negativa
    if (quantity <= 0) {
      this.removeFromCart(this.cart.indexOf(item));
      return;
    }

    // Verifica se há estoque suficiente
    if (item.product && quantity > item.product.stock) {
      this.formError = `Estoque insuficiente. Disponível: ${item.product.stock}`;
      return;
    }

    // Atualiza quantidade e subtotal
    item.quantity = quantity;
    item.subtotal = quantity * item.unitPrice;
    this.formError = '';
  }

  increaseQuantity(item: CartItem): void {
    this.updateQuantity(item.productId, item.quantity + 1);
  }

  decreaseQuantity(item: CartItem): void {
    this.updateQuantity(item.productId, item.quantity - 1);
  }

  getSubtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  getTotal(): number {
    return this.getSubtotal() - this.discount;
  }

  finalizeSale(): void {
    // Validações
    if (!this.selectedClient) {
      this.formError = 'Selecione um cliente';
      return;
    }

    if (this.cart.length === 0) {
      this.formError = 'Adicione produtos ao carrinho';
      return;
    }

    // Cria a venda
    const saleItems: SaleItem[] = this.cart.map(item => ({
      id: Date.now().toString() + Math.random(),
      productId: item.productId,
      product: item.product,
      quantity: item.quantity,
      unitPrice: item.unitPrice,
      subtotal: item.subtotal
    }));

    const newSale: Omit<Sale, 'id' | 'createdAt'> = {
      clientId: this.selectedClient,
      items: saleItems,
      subtotal: this.getSubtotal(),
      discount: this.discount,
      total: this.getTotal(),
      paymentMethod: this.paymentMethod,
      status: 'completed'
    };

    this.saleService.create(newSale).subscribe({
      next: () => {
        // Atualiza estoque dos produtos
        this.cart.forEach(item => {
          this.productService.updateStock(item.productId, -item.quantity).subscribe();
        });

        // Se for crédito, atualiza dívida do cliente
        if (this.paymentMethod === 'credit') {
          this.clientService.updateDebt(this.selectedClient, this.getTotal()).subscribe();
        }

        this.loadSales();
        this.closeNewSaleDialog();
      },
      error: (err) => {
        this.formError = 'Erro ao finalizar venda';
        console.error(err);
      }
    });
  }
}

interface CartItem {
  productId: string;
  product?: Product;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}
