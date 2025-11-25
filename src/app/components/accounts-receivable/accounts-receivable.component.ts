import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../services/account.service';
import { ClientService } from '../../services/client.service';
import { AccountReceivable, Client } from '../../models';
import { AccountReceivableDialogComponent } from './account-receivable-dialog.component';

@Component({
  selector: 'app-accounts-receivable',
  templateUrl: './accounts-receivable.component.html',
  styleUrls: ['./accounts-receivable.component.scss']
})
export class AccountsReceivableComponent implements OnInit {
  accounts: AccountReceivable[] = [];
  clients: Client[] = [];
  displayedColumns: string[] = ['client', 'description', 'amount', 'dueDate', 'status', 'actions'];
  loading = true;

  constructor(
    private accountService: AccountService,
    private clientService: ClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
    this.loadClients();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAllReceivables().subscribe({
      next: (accounts) => {
        this.accounts = accounts;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar contas:', err);
        this.loading = false;
      }
    });
  }

  loadClients(): void {
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
      }
    });
  }

  openAccountDialog(account?: AccountReceivable): void {
    const dialogRef = this.dialog.open(AccountReceivableDialogComponent, {
      width: '600px',
      data: { account, clients: this.clients }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (account) {
          this.accountService.updateReceivable(account.id, result).subscribe({
            next: () => this.loadAccounts()
          });
        } else {
          this.accountService.createReceivable(result).subscribe({
            next: () => this.loadAccounts()
          });
        }
      }
    });
  }

  markAsPaid(id: string): void {
    this.accountService.markReceivableAsPaid(id).subscribe({
      next: () => {
        this.loadAccounts();
      }
    });
  }

  deleteAccount(id: string): void {
    if (confirm('Deseja realmente excluir esta conta?')) {
      this.accountService.deleteReceivable(id).subscribe({
        next: () => {
          this.loadAccounts();
        }
      });
    }
  }

  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }

  getStatusLabel(status: string): string {
    const labels: { [key: string]: string } = {
      'pending': 'Pendente',
      'paid': 'Pago',
      'overdue': 'Vencido'
    };
    return labels[status] || status;
  }
}
