import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { ClientService } from '../../services/client.service';
import { Client } from '../../models';
import { ClientDialogComponent } from './client-dialog.component';

@Component({
  selector: 'app-clients',
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {
  clients: Client[] = [];
  displayedColumns: string[] = ['name', 'email', 'phone', 'creditLimit', 'currentDebt', 'actions'];
  loading = true;

  constructor(
    private clientService: ClientService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadClients();
  }

  loadClients(): void {
    this.loading = true;
    this.clientService.getAll().subscribe({
      next: (clients) => {
        this.clients = clients;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar clientes:', err);
        this.loading = false;
      }
    });
  }

  openClientDialog(client?: Client): void {
    const dialogRef = this.dialog.open(ClientDialogComponent, {
      width: '600px',
      data: client || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (client) {
          this.clientService.update(client.id, result).subscribe({
            next: () => this.loadClients()
          });
        } else {
          this.clientService.create(result).subscribe({
            next: () => this.loadClients()
          });
        }
      }
    });
  }

  deleteClient(id: string): void {
    if (confirm('Deseja realmente excluir este cliente?')) {
      this.clientService.delete(id).subscribe({
        next: () => {
          this.loadClients();
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
}
