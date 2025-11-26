import { Component, HostListener, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatTableModule } from '@angular/material/table';
import { MatCardModule } from '@angular/material/card';
import { MatSelectModule } from '@angular/material/select';
import { MatDividerModule } from '@angular/material/divider';
import { MatDialogModule, MatDialog } from '@angular/material/dialog';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatBadgeModule } from '@angular/material/badge';
import { MatTooltipModule } from '@angular/material/tooltip';
import jsPDF from 'jspdf';

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  subtotal: number;
}

interface Payment {
  method: string;
  amount: number;
  installments?: number;
  installmentValue?: number;
}

interface CashRegister {
  isOpen: boolean;
  openedAt?: Date;
  openingBalance: number;
  currentBalance: number;
  sales: number;
  withdrawals: number;
  deposits: number;
}

interface DailySale {
  id: number;
  time: string;
  total: number;
  paymentMethod: string;
  items: number;
}

@Component({
  selector: 'app-pdv',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
    MatTableModule,
    MatCardModule,
    MatSelectModule,
    MatDividerModule,
    MatDialogModule,
    MatSnackBarModule,
    MatBadgeModule,
    MatTooltipModule
  ],
  templateUrl: './pdv.component.html',
  styleUrl: './pdv.component.scss'
})
export class PdvComponent implements OnInit {
  searchProduct = '';
  cart: CartItem[] = [];
  displayedColumns: string[] = ['name', 'price', 'quantity', 'subtotal', 'actions'];
  
  paymentMethod = 'money';
  discount = 0;
  
  // Múltiplas formas de pagamento
  payments: Payment[] = [];
  showPaymentModal = false;
  currentPaymentMethod = 'money';
  currentPaymentAmount = 0;
  installments = 1;
  cashReceived = 0;
  
  // Taxas de parcelamento
  installmentFees: { [key: number]: number } = {
    1: 0,
    2: 0,
    3: 2.5,
    4: 3.5,
    5: 4.5,
    6: 5.5,
    10: 8,
    12: 10
  };

  // Caixa
  cashRegister: CashRegister = {
    isOpen: false,
    openingBalance: 0,
    currentBalance: 0,
    sales: 0,
    withdrawals: 0,
    deposits: 0
  };

  // Histórico de vendas do dia
  dailySales: DailySale[] = [];
  showDailySales = false;

  // Código de barras
  barcodeInput = '';
  
  // Mock de produtos disponíveis
  availableProducts = [
    { 
      id: 1, 
      name: 'Notebook Dell', 
      price: 3500.00, 
      stock: 10, 
      imageUrl: 'https://images.unsplash.com/photo-1496181133206-80ce9b88a853?w=400&h=400&fit=crop' 
    },
    { 
      id: 2, 
      name: 'Mouse Logitech', 
      price: 89.90, 
      stock: 50, 
      imageUrl: 'https://images.unsplash.com/photo-1527864550417-7fd91fc51a46?w=400&h=400&fit=crop' 
    },
    { 
      id: 3, 
      name: 'Teclado Mecânico', 
      price: 450.00, 
      stock: 25, 
      imageUrl: 'https://images.unsplash.com/photo-1587829741301-dc798b83add3?w=400&h=400&fit=crop' 
    },
    { 
      id: 4, 
      name: 'Monitor LG 24"', 
      price: 899.00, 
      stock: 15, 
      imageUrl: 'https://images.unsplash.com/photo-1527443224154-c4a3942d3acf?w=400&h=400&fit=crop' 
    },
    { 
      id: 5, 
      name: 'Webcam HD', 
      price: 250.00, 
      stock: 30, 
      imageUrl: 'https://images.unsplash.com/photo-1587825140708-dfaf72ae4b04?w=400&h=400&fit=crop' 
    }
  ];

  get subtotal(): number {
    return this.cart.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get discountAmount(): number {
    return (this.subtotal * this.discount) / 100;
  }

  get total(): number {
    return this.subtotal - this.discountAmount;
  }

  get totalPaid(): number {
    return this.payments.reduce((sum, p) => sum + p.amount, 0);
  }

  get remaining(): number {
    return Math.max(0, this.total - this.totalPaid);
  }

  get change(): number {
    return Math.max(0, this.totalPaid - this.total);
  }

  get installmentValue(): number {
    if (this.installments <= 1) return this.currentPaymentAmount;
    const fee = this.installmentFees[this.installments] || 0;
    const totalWithFee = this.currentPaymentAmount * (1 + fee / 100);
    return totalWithFee / this.installments;
  }

  get totalWithInstallmentFee(): number {
    return this.installmentValue * this.installments;
  }

  constructor(
    private dialog: MatDialog,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.loadCashRegister();
    this.loadDailySales();
  }

  // Atalhos de teclado
  @HostListener('window:keydown', ['$event'])
  handleKeyboardEvent(event: KeyboardEvent): void {
    // F2 - Finalizar venda
    if (event.key === 'F2') {
      event.preventDefault();
      if (this.cart.length > 0) {
        this.finalizeSale();
      }
    }
    
    // F3 - Limpar carrinho
    if (event.key === 'F3') {
      event.preventDefault();
      this.clearCart();
    }
    
    // F4 - Abrir pagamento
    if (event.key === 'F4') {
      event.preventDefault();
      if (this.cart.length > 0) {
        this.showPaymentModal = true;
      }
    }
    
    // F5 - Histórico do dia
    if (event.key === 'F5') {
      event.preventDefault();
      this.toggleDailySales();
    }
    
    // F8 - Sangria
    if (event.key === 'F8') {
      event.preventDefault();
      if (this.cashRegister.isOpen) {
        this.openWithdrawalDialog();
      }
    }
    
    // F9 - Suprimento
    if (event.key === 'F9') {
      event.preventDefault();
      if (this.cashRegister.isOpen) {
        this.openDepositDialog();
      }
    }
    
    // ESC - Cancelar/Fechar modais
    if (event.key === 'Escape') {
      this.showPaymentModal = false;
      this.showDailySales = false;
    }
  }

  // Código de barras
  onBarcodeInput(event: any): void {
    const barcode = event.target.value;
    if (barcode.length >= 8) {
      const product = this.availableProducts.find(p => p.id.toString() === barcode);
      if (product) {
        this.addProduct(product.id);
        this.barcodeInput = '';
        this.showSnackBar(`${product.name} adicionado!`);
      } else {
        this.showSnackBar('Produto não encontrado!', 'error');
      }
    }
  }

  // Caixa
  loadCashRegister(): void {
    const stored = localStorage.getItem('cashRegister');
    if (stored) {
      this.cashRegister = JSON.parse(stored);
    }
  }

  saveCashRegister(): void {
    localStorage.setItem('cashRegister', JSON.stringify(this.cashRegister));
  }

  showOpenCashDialog(): void {
    const balance = prompt('Digite o saldo inicial do caixa:');
    if (balance) {
      const value = parseFloat(balance);
      if (value >= 0) {
        this.openCashRegister(value);
      } else {
        this.showSnackBar('Valor inválido!', 'error');
      }
    }
  }

  openCashRegister(openingBalance: number): void {
    this.cashRegister = {
      isOpen: true,
      openedAt: new Date(),
      openingBalance,
      currentBalance: openingBalance,
      sales: 0,
      withdrawals: 0,
      deposits: 0
    };
    this.saveCashRegister();
    this.showSnackBar('Caixa aberto com sucesso!');
  }

  closeCashRegister(): void {
    if (!this.cashRegister.isOpen) return;
    
    const report = `
      Abertura: ${this.cashRegister.openedAt?.toLocaleString()}
      Saldo Inicial: R$ ${this.cashRegister.openingBalance.toFixed(2)}
      Vendas: R$ ${this.cashRegister.sales.toFixed(2)}
      Sangrias: R$ ${this.cashRegister.withdrawals.toFixed(2)}
      Suprimentos: R$ ${this.cashRegister.deposits.toFixed(2)}
      Saldo Final: R$ ${this.cashRegister.currentBalance.toFixed(2)}
    `;
    
    if (confirm(`Deseja fechar o caixa?\n${report}`)) {
      this.cashRegister.isOpen = false;
      this.saveCashRegister();
      this.showSnackBar('Caixa fechado com sucesso!');
    }
  }

  openWithdrawalDialog(): void {
    const amount = prompt('Digite o valor da sangria:');
    if (amount) {
      const value = parseFloat(amount);
      if (value > 0 && value <= this.cashRegister.currentBalance) {
        this.cashRegister.withdrawals += value;
        this.cashRegister.currentBalance -= value;
        this.saveCashRegister();
        this.showSnackBar(`Sangria de R$ ${value.toFixed(2)} realizada!`);
      } else {
        this.showSnackBar('Valor inválido!', 'error');
      }
    }
  }

  openDepositDialog(): void {
    const amount = prompt('Digite o valor do suprimento:');
    if (amount) {
      const value = parseFloat(amount);
      if (value > 0) {
        this.cashRegister.deposits += value;
        this.cashRegister.currentBalance += value;
        this.saveCashRegister();
        this.showSnackBar(`Suprimento de R$ ${value.toFixed(2)} realizado!`);
      } else {
        this.showSnackBar('Valor inválido!', 'error');
      }
    }
  }

  // Histórico de vendas
  loadDailySales(): void {
    const stored = localStorage.getItem('dailySales');
    if (stored) {
      this.dailySales = JSON.parse(stored);
    }
  }

  saveDailySale(sale: DailySale): void {
    this.dailySales.push(sale);
    localStorage.setItem('dailySales', JSON.stringify(this.dailySales));
  }

  toggleDailySales(): void {
    this.showDailySales = !this.showDailySales;
  }

  getTodaysSalesTotal(): number {
    return this.dailySales.reduce((sum, sale) => sum + sale.total, 0);
  }

  getTodaysSalesCount(): number {
    return this.dailySales.length;
  }

  exportDailySalesToPDF(): void {
    const doc = new jsPDF({
      format: 'a4',
      unit: 'mm'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 15;

    // Linha de recorte superior
    doc.setLineWidth(0.3);
    doc.setDrawColor(200, 200, 200);
    doc.line(10, yPos, pageWidth - 10, yPos);
    
    yPos += 8;

    // Cabeçalho
    doc.setTextColor(0, 0, 0);
    doc.setFontSize(20);
    doc.setFont('helvetica', 'bold');
    doc.text('RELATÓRIO DE VENDAS', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 6;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    const today = new Date().toLocaleDateString('pt-BR', { 
      weekday: 'long', 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
    doc.text(today, pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setLineWidth(0.5);
    doc.setDrawColor(0, 0, 0);
    doc.line(20, yPos, pageWidth - 20, yPos);

    // Informações do Caixa
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Informações do Caixa', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    
    if (this.cashRegister.openedAt) {
      doc.text(`Abertura: ${new Date(this.cashRegister.openedAt).toLocaleString('pt-BR')}`, 20, yPos);
      yPos += 6;
    }
    
    doc.text(`Saldo Inicial: R$ ${this.cashRegister.openingBalance.toFixed(2)}`, 20, yPos);
    yPos += 6;
    doc.text(`Vendas: R$ ${this.cashRegister.sales.toFixed(2)}`, 20, yPos);
    yPos += 6;
    doc.text(`Sangrias: R$ ${this.cashRegister.withdrawals.toFixed(2)}`, 20, yPos);
    yPos += 6;
    doc.text(`Suprimentos: R$ ${this.cashRegister.deposits.toFixed(2)}`, 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text(`Saldo Atual: R$ ${this.cashRegister.currentBalance.toFixed(2)}`, 20, yPos);

    // Resumo de Vendas
    yPos += 15;
    doc.setFontSize(12);
    doc.text('Resumo de Vendas', 20, yPos);
    
    yPos += 8;
    doc.setFontSize(10);
    doc.setFont('helvetica', 'normal');
    doc.text(`Total de Vendas: ${this.getTodaysSalesCount()}`, 20, yPos);
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(12);
    doc.text(`Faturamento Total: R$ ${this.getTodaysSalesTotal().toFixed(2)}`, 20, yPos);

    // Tabela de Vendas
    yPos += 15;
    doc.setFontSize(12);
    doc.setFont('helvetica', 'bold');
    doc.text('Detalhamento das Vendas', 20, yPos);

    yPos += 8;
    doc.setFontSize(9);
    
    // Cabeçalho da tabela
    doc.setFillColor(240, 240, 240);
    doc.rect(20, yPos - 5, pageWidth - 40, 8, 'F');
    doc.setFont('helvetica', 'bold');
    doc.text('#', 25, yPos);
    doc.text('Hora', 40, yPos);
    doc.text('Itens', 70, yPos);
    doc.text('Pagamento', 95, yPos);
    doc.text('Valor', pageWidth - 25, yPos, { align: 'right' });

    yPos += 8;
    doc.setFont('helvetica', 'normal');

    // Linhas da tabela
    this.dailySales.forEach((sale, index) => {
      if (yPos > 270) {
        doc.addPage();
        yPos = 20;
      }

      doc.text(`${index + 1}`, 25, yPos);
      doc.text(sale.time, 40, yPos);
      doc.text(`${sale.items}`, 70, yPos);
      doc.text(this.getPaymentMethodLabel(sale.paymentMethod), 95, yPos);
      doc.text(`R$ ${sale.total.toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });
      
      yPos += 7;
    });

    // Linha final
    yPos += 5;
    doc.setLineWidth(0.5);
    doc.line(20, yPos, pageWidth - 20, yPos);

    // Total
    yPos += 8;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(11);
    doc.text('TOTAL:', pageWidth - 70, yPos);
    doc.text(`R$ ${this.getTodaysSalesTotal().toFixed(2)}`, pageWidth - 25, yPos, { align: 'right' });

    // Rodapé
    yPos += 20;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'italic');
    doc.text(`Relatório gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, yPos, { align: 'center' });

    // Salvar PDF
    const filename = `vendas-${new Date().toLocaleDateString('pt-BR').replace(/\//g, '-')}.pdf`;
    doc.save(filename);
    
    this.showSnackBar('Relatório exportado com sucesso!');
  }

  // Utilitários
  showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  addProduct(productId: number): void {
    const product = this.availableProducts.find(p => p.id === productId);
    if (!product) return;

    const existingItem = this.cart.find(item => item.id === productId);
    
    if (existingItem) {
      existingItem.quantity++;
      existingItem.subtotal = existingItem.quantity * existingItem.price;
    } else {
      this.cart.push({
        id: product.id,
        name: product.name,
        price: product.price,
        quantity: 1,
        subtotal: product.price
      });
    }
  }

  updateQuantity(item: CartItem, quantity: number): void {
    if (quantity <= 0) {
      this.removeItem(item);
      return;
    }
    item.quantity = quantity;
    item.subtotal = item.quantity * item.price;
  }

  removeItem(item: CartItem): void {
    const index = this.cart.indexOf(item);
    if (index > -1) {
      this.cart.splice(index, 1);
    }
  }

  clearCart(): void {
    this.cart = [];
    this.discount = 0;
    this.searchProduct = '';
    this.payments = [];
    this.cashReceived = 0;
  }

  openPaymentModal(): void {
    if (this.remaining <= 0) {
      alert('Pagamento já foi realizado!');
      return;
    }
    this.currentPaymentAmount = this.remaining;
    this.showPaymentModal = true;
  }

  closePaymentModal(): void {
    this.showPaymentModal = false;
    this.currentPaymentMethod = 'money';
    this.currentPaymentAmount = 0;
    this.installments = 1;
  }

  addPayment(): void {
    if (this.currentPaymentAmount <= 0) {
      alert('Valor inválido!');
      return;
    }

    if (this.currentPaymentAmount > this.remaining) {
      alert('Valor maior que o restante!');
      return;
    }

    const payment: Payment = {
      method: this.currentPaymentMethod,
      amount: this.currentPaymentAmount
    };

    if (this.currentPaymentMethod === 'credit' && this.installments > 1) {
      payment.installments = this.installments;
      payment.installmentValue = this.installmentValue;
      payment.amount = this.totalWithInstallmentFee;
    }

    this.payments.push(payment);
    this.closePaymentModal();
  }

  removePayment(index: number): void {
    this.payments.splice(index, 1);
  }

  getPaymentMethodLabel(method: string): string {
    const labels: { [key: string]: string } = {
      'money': 'Dinheiro',
      'debit': 'Débito',
      'credit': 'Crédito',
      'pix': 'PIX'
    };
    return labels[method] || method;
  }

  calculateChange(): void {
    if (this.currentPaymentMethod === 'money' && this.cashReceived > 0) {
      const change = this.cashReceived - this.currentPaymentAmount;
      if (change >= 0) {
        alert(`Troco: R$ ${change.toFixed(2)}`);
      }
    }
  }

  printReceipt(): void {
    const doc = new jsPDF({
      format: [80, 297], // Formato de cupom (80mm de largura)
      unit: 'mm'
    });

    const pageWidth = doc.internal.pageSize.getWidth();
    let yPos = 10;

    // Cabeçalho
    doc.setFontSize(16);
    doc.setFont('helvetica', 'bold');
    doc.text('VendaMax', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 6;
    doc.setFontSize(8);
    doc.setFont('helvetica', 'normal');
    doc.text('Gestão Inteligente', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 8;
    doc.setFontSize(7);
    doc.text('CNPJ: 00.000.000/0000-00', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 4;
    doc.text('Rua Exemplo, 123 - Centro', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 4;
    doc.text('Tel: (00) 0000-0000', pageWidth / 2, yPos, { align: 'center' });

    // Linha separadora
    yPos += 6;
    doc.setLineWidth(0.5);
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Data e hora
    yPos += 6;
    const now = new Date();
    const dateStr = now.toLocaleDateString('pt-BR');
    const timeStr = now.toLocaleTimeString('pt-BR');
    doc.setFontSize(8);
    doc.text(`Data: ${dateStr}  Hora: ${timeStr}`, pageWidth / 2, yPos, { align: 'center' });

    // Linha separadora
    yPos += 6;
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Itens
    yPos += 6;
    doc.setFont('helvetica', 'bold');
    doc.text('CUPOM NÃO FISCAL', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    this.cart.forEach(item => {
      // Nome do produto
      doc.text(item.name, 5, yPos);
      yPos += 4;
      
      // Quantidade, preço unitário e subtotal
      const itemLine = `${item.quantity} x R$ ${item.price.toFixed(2)} = R$ ${item.subtotal.toFixed(2)}`;
      doc.text(itemLine, 10, yPos);
      yPos += 5;
    });

    // Linha separadora
    yPos += 2;
    doc.line(5, yPos, pageWidth - 5, yPos);

    // Totais
    yPos += 5;
    doc.setFontSize(8);
    doc.text('Subtotal:', 5, yPos);
    doc.text(`R$ ${this.subtotal.toFixed(2)}`, pageWidth - 5, yPos, { align: 'right' });

    if (this.discountAmount > 0) {
      yPos += 5;
      doc.text(`Desconto (${this.discount}%):`, 5, yPos);
      doc.text(`- R$ ${this.discountAmount.toFixed(2)}`, pageWidth - 5, yPos, { align: 'right' });
    }

    yPos += 5;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(10);
    doc.text('TOTAL:', 5, yPos);
    doc.text(`R$ ${this.total.toFixed(2)}`, pageWidth - 5, yPos, { align: 'right' });

    // Formas de pagamento
    yPos += 7;
    doc.setFont('helvetica', 'bold');
    doc.setFontSize(8);
    doc.text('PAGAMENTO:', 5, yPos);

    yPos += 5;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);

    this.payments.forEach(payment => {
      const paymentLabel = this.getPaymentMethodLabel(payment.method);
      let paymentText = `${paymentLabel}: R$ ${payment.amount.toFixed(2)}`;
      
      if (payment.installments && payment.installments > 1) {
        paymentText += ` (${payment.installments}x)`;
      }
      
      doc.text(paymentText, 5, yPos);
      yPos += 4;
    });

    if (this.change > 0) {
      yPos += 3;
      doc.setFont('helvetica', 'bold');
      doc.text('Troco:', 5, yPos);
      doc.text(`R$ ${this.change.toFixed(2)}`, pageWidth - 5, yPos, { align: 'right' });
    }

    // Rodapé
    yPos += 10;
    doc.setLineWidth(0.5);
    doc.line(5, yPos, pageWidth - 5, yPos);

    yPos += 6;
    doc.setFont('helvetica', 'normal');
    doc.setFontSize(7);
    doc.text('Obrigado pela preferência!', pageWidth / 2, yPos, { align: 'center' });
    
    yPos += 4;
    doc.text('Volte sempre!', pageWidth / 2, yPos, { align: 'center' });

    // Salvar ou abrir PDF
    doc.save(`cupom-${Date.now()}.pdf`);
  }

  finalizeSale(): void {
    if (this.cart.length === 0) {
      this.showSnackBar('Carrinho vazio!', 'error');
      return;
    }

    if (this.remaining > 0) {
      this.showSnackBar(`Falta pagar: R$ ${this.remaining.toFixed(2)}`, 'error');
      return;
    }

    if (!this.cashRegister.isOpen) {
      this.showSnackBar('Caixa fechado! Abra o caixa para realizar vendas.', 'error');
      return;
    }

    const saleData = {
      items: this.cart,
      subtotal: this.subtotal,
      discount: this.discountAmount,
      total: this.total,
      payments: this.payments,
      totalPaid: this.totalPaid,
      change: this.change,
      date: new Date()
    };

    // Registrar venda no histórico
    const dailySale: DailySale = {
      id: Date.now(),
      time: new Date().toLocaleTimeString('pt-BR'),
      total: this.total,
      paymentMethod: this.payments.map(p => p.method).join(', '),
      items: this.cart.length
    };
    this.saveDailySale(dailySale);

    // Atualizar caixa
    this.cashRegister.sales += this.total;
    this.cashRegister.currentBalance += this.total;
    this.saveCashRegister();

    console.log('Venda finalizada:', saleData);
    
    // Perguntar se deseja imprimir cupom
    const printCupom = confirm('Venda finalizada com sucesso!\n\nDeseja imprimir o cupom?');
    
    if (printCupom) {
      this.printReceipt();
    }
    
    this.showSnackBar('Venda finalizada com sucesso!');
    this.clearCart();
  }
}
