import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { AccountService } from '../../services/account.service';
import { AccountPayable } from '../../models';
import { AccountPayableDialogComponent } from './account-payable-dialog.component';

@Component({
  selector: 'app-accounts-payable',
  templateUrl: './accounts-payable.component.html',
  styleUrls: ['./accounts-payable.component.scss']
})
export class AccountsPayableComponent implements OnInit {
  accounts: AccountPayable[] = [];
  displayedColumns: string[] = ['description', 'category', 'amount', 'dueDate', 'status', 'actions'];
  loading = true;

  constructor(
    private accountService: AccountService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadAccounts();
  }

  loadAccounts(): void {
    this.loading = true;
    this.accountService.getAllPayables().subscribe({
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

  openAccountDialog(account?: AccountPayable): void {
    const dialogRef = this.dialog.open(AccountPayableDialogComponent, {
      width: '600px',
      data: account || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (account) {
          this.accountService.updatePayable(account.id, result).subscribe({
            next: () => this.loadAccounts()
          });
        } else {
          this.accountService.createPayable(result).subscribe({
            next: () => this.loadAccounts()
          });
        }
      }
    });
  }

  markAsPaid(id: string): void {
    this.accountService.markPayableAsPaid(id).subscribe({
      next: () => {
        this.loadAccounts();
      }
    });
  }

  deleteAccount(id: string): void {
    if (confirm('Deseja realmente excluir esta conta?')) {
      this.accountService.deletePayable(id).subscribe({
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
