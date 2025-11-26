import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatTableModule } from '@angular/material/table';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatCardModule } from '@angular/material/card';
import { MatChipsModule } from '@angular/material/chips';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatTooltipModule } from '@angular/material/tooltip';
import { UserManagementService } from '../../services/user-management.service';
import { User, UserRole } from '../../models';
import { MatDialog } from '@angular/material/dialog';
import { UserDialogComponent } from './user-dialog.component';

@Component({
  selector: 'app-user-management',
  standalone: true,
  imports: [
    CommonModule,
    MatTableModule,
    MatButtonModule,
    MatIconModule,
    MatCardModule,
    MatChipsModule,
    MatProgressSpinnerModule,
    MatTooltipModule
  ],
  templateUrl: './user-management.component.html',
  styleUrls: ['./user-management.component.scss']
})
export class UserManagementComponent implements OnInit {
  users: User[] = [];
  loading = true;
  displayedColumns: string[] = ['name', 'email', 'role', 'active', 'lastLogin', 'actions'];

  roleLabels: Record<UserRole, string> = {
    admin: 'Administrador',
    manager: 'Gerente',
    seller: 'Vendedor',
    cashier: 'Caixa'
  };

  constructor(
    private userService: UserManagementService,
    private dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.loadUsers();
  }

  loadUsers(): void {
    this.loading = true;
    this.userService.getAll().subscribe({
      next: (users) => {
        this.users = users;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar usuários:', err);
        this.loading = false;
      }
    });
  }

  openUserDialog(user?: User): void {
    const dialogRef = this.dialog.open(UserDialogComponent, {
      width: '600px',
      data: { user }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (user) {
          this.updateUser(user.id, result);
        } else {
          this.createUser(result);
        }
      }
    });
  }

  createUser(userData: Partial<User>): void {
    this.userService.create(userData as Omit<User, 'id' | 'createdAt' | 'updatedAt'>).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => console.error('Erro ao criar usuário:', err)
    });
  }

  updateUser(id: string, userData: Partial<User>): void {
    this.userService.update(id, userData).subscribe({
      next: () => {
        this.loadUsers();
      },
      error: (err) => console.error('Erro ao atualizar usuário:', err)
    });
  }

  toggleActive(user: User): void {
    if (confirm(`Deseja ${user.active ? 'desativar' : 'ativar'} o usuário ${user.name}?`)) {
      this.userService.toggleActive(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.error('Erro ao alterar status:', err)
      });
    }
  }

  deleteUser(user: User): void {
    if (confirm(`Deseja realmente excluir o usuário ${user.name}?`)) {
      this.userService.delete(user.id).subscribe({
        next: () => {
          this.loadUsers();
        },
        error: (err) => console.error('Erro ao excluir usuário:', err)
      });
    }
  }

  getRoleLabel(role: UserRole): string {
    return this.roleLabels[role] || role;
  }

  formatDate(date?: Date): string {
    if (!date) return 'Nunca';
    return new Date(date).toLocaleString('pt-BR');
  }
}
