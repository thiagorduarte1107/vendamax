import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { MatDialog, MatDialogModule } from '@angular/material/dialog';
import { Router } from '@angular/router';
import { ConfirmationService } from '../../services/confirmation.service';

interface ComandaItem {
  id: number;
  productId: number;
  productName: string;
  quantity: number;
  unitPrice: number;
  subtotal: number;
}

interface Comanda {
  id: number;
  number: string;
  sellerId: number;
  sellerName: string;
  customerName?: string;
  table?: string;
  items: ComandaItem[];
  subtotal: number;
  status: 'OPEN' | 'CLOSED';
  openedAt: Date;
  closedAt?: Date;
}

@Component({
  selector: 'app-comandas',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatCardModule,
    MatButtonModule,
    MatIconModule,
    MatChipsModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatBadgeModule,
    MatSnackBarModule,
    MatDialogModule
  ],
  templateUrl: './comandas.component.html',
  styleUrls: ['./comandas.component.scss']
})
export class ComandasComponent implements OnInit {
  comandas: Comanda[] = [];
  sellers: any[] = [];
  filteredComandas: Comanda[] = [];
  selectedStatus: string = 'OPEN';
  selectedSeller: number | null = null;
  searchTerm: string = '';

  constructor(
    private snackBar: MatSnackBar,
    private dialog: MatDialog,
    private router: Router,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadSellers();
    this.loadComandas();
  }

  loadSellers(): void {
    // Carregar usuários do sistema com role SELLER ou ADMIN
    const users = localStorage.getItem('users');
    if (users) {
      const allUsers = JSON.parse(users);
      this.sellers = allUsers.filter((u: any) => 
        (u.role === 'SELLER' || u.role === 'ADMIN' || u.role === 'CASHIER') && u.active
      );
    } else {
      // Vendedores padrão
      this.sellers = [
        { id: 1, name: 'João Silva', role: 'SELLER', active: true },
        { id: 2, name: 'Maria Santos', role: 'SELLER', active: true }
      ];
    }
  }

  loadComandas(): void {
    const stored = localStorage.getItem('comandas');
    if (stored) {
      this.comandas = JSON.parse(stored).map((c: any) => ({
        ...c,
        openedAt: new Date(c.openedAt),
        closedAt: c.closedAt ? new Date(c.closedAt) : undefined
      }));
    }
    this.applyFilters();
  }

  saveComandas(): void {
    localStorage.setItem('comandas', JSON.stringify(this.comandas));
  }

  applyFilters(): void {
    this.filteredComandas = this.comandas.filter(comanda => {
      const matchesStatus = this.selectedStatus === 'ALL' || comanda.status === this.selectedStatus;
      const matchesSeller = !this.selectedSeller || comanda.sellerId === this.selectedSeller;
      const matchesSearch = !this.searchTerm || 
        comanda.number.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comanda.customerName?.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        comanda.table?.toLowerCase().includes(this.searchTerm.toLowerCase());
      
      return matchesStatus && matchesSeller && matchesSearch;
    });

    // Ordenar por data de abertura (mais recentes primeiro)
    this.filteredComandas.sort((a, b) => b.openedAt.getTime() - a.openedAt.getTime());
  }

  onFilterChange(): void {
    this.applyFilters();
  }

  newComanda(): void {
    if (this.sellers.length === 0) {
      this.showSnackBar('Nenhum vendedor disponível!', 'error');
      return;
    }

    const sellerIdStr = prompt('ID do Vendedor (1-' + this.sellers.length + '):');
    if (!sellerIdStr) return;

    const sellerId = parseInt(sellerIdStr);
    const seller = this.sellers.find(s => s.id === sellerId && s.active);
    
    if (!seller) {
      this.showSnackBar('Vendedor não encontrado!', 'error');
      return;
    }

    const customerName = prompt('Nome do Cliente (opcional):') || undefined;
    const table = prompt('Mesa/Número (opcional):') || undefined;

    const newComanda: Comanda = {
      id: Date.now(),
      number: this.generateComandaNumber(),
      sellerId: seller.id,
      sellerName: seller.name,
      customerName,
      table,
      items: [],
      subtotal: 0,
      status: 'OPEN',
      openedAt: new Date()
    };

    this.comandas.push(newComanda);
    this.saveComandas();
    this.applyFilters();
    this.showSnackBar('Comanda criada com sucesso!');
  }

  generateComandaNumber(): string {
    const today = new Date();
    const dateStr = today.toISOString().split('T')[0].replace(/-/g, '');
    const count = this.comandas.filter(c => 
      c.openedAt.toDateString() === today.toDateString()
    ).length + 1;
    return `CMD${dateStr}${count.toString().padStart(3, '0')}`;
  }

  addItemToComanda(comanda: Comanda): void {
    // Redirecionar para catálogo com comanda ID
    localStorage.setItem('current_comanda_id', comanda.id.toString());
    this.router.navigate(['/catalog']);
  }

  closeComanda(comanda: Comanda): void {
    if (comanda.items.length === 0) {
      this.showSnackBar('Comanda sem itens!', 'error');
      return;
    }

    this.confirmationService.confirm({
      title: 'Fechar Comanda?',
      message: `Comanda ${comanda.number}\nTotal: R$ ${comanda.subtotal.toFixed(2)}\n\nA comanda ficará disponível para pagamento no PDV.`,
      confirmText: 'Fechar',
      cancelText: 'Cancelar',
      type: 'warning'
    }).subscribe(confirmed => {
      if (confirmed) {
        comanda.status = 'CLOSED';
        comanda.closedAt = new Date();
        this.saveComandas();
        this.applyFilters();
        this.showSnackBar('Comanda fechada! Disponível para pagamento no PDV.', 'success');
      }
    });
  }

  deleteComanda(comanda: Comanda): void {
    if (comanda.status === 'CLOSED') {
      this.showSnackBar('Não é possível excluir comanda fechada!', 'error');
      return;
    }

    this.confirmationService.confirmDelete(`Comanda ${comanda.number}`, 'comanda').subscribe(confirmed => {
      if (confirmed) {
        this.comandas = this.comandas.filter(c => c.id !== comanda.id);
        this.saveComandas();
        this.applyFilters();
        this.showSnackBar('Comanda excluída com sucesso!');
      }
    });
  }

  getStatusColor(status: string): string {
    return status === 'OPEN' ? 'primary' : 'accent';
  }

  getStatusLabel(status: string): string {
    return status === 'OPEN' ? 'Aberta' : 'Fechada';
  }

  getTotalOpen(): number {
    return this.comandas.filter(c => c.status === 'OPEN').length;
  }

  getTotalClosed(): number {
    return this.comandas.filter(c => c.status === 'CLOSED').length;
  }

  getTotalValue(): number {
    return this.comandas
      .filter(c => c.status === 'OPEN')
      .reduce((sum, c) => sum + c.subtotal, 0);
  }

  showSnackBar(message: string, type: 'success' | 'error' = 'success'): void {
    this.snackBar.open(message, 'Fechar', {
      duration: 3000,
      horizontalPosition: 'end',
      verticalPosition: 'top',
      panelClass: type === 'error' ? ['error-snackbar'] : ['success-snackbar']
    });
  }

  manageSellers(): void {
    this.router.navigate(['/user-management']);
  }
}
