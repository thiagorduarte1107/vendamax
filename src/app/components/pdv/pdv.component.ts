import { Component } from '@angular/core';
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
    MatDividerModule
  ],
  templateUrl: './pdv.component.html',
  styleUrl: './pdv.component.scss'
})
export class PdvComponent {
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
      alert('Carrinho vazio!');
      return;
    }

    if (this.remaining > 0) {
      alert(`Falta pagar: R$ ${this.remaining.toFixed(2)}`);
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

    console.log('Venda finalizada:', saleData);
    
    // Perguntar se deseja imprimir cupom
    const printCupom = confirm('Venda finalizada com sucesso!\\n\\nDeseja imprimir o cupom?');
    
    if (printCupom) {
      this.printReceipt();
    }
    
    this.clearCart();
  }
}
