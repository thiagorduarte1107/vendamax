import { Component, Inject, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef, MatDialogModule } from '@angular/material/dialog';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { User, UserRole, UserPermissions } from '../../models';
import { UserManagementService } from '../../services/user-management.service';

@Component({
  selector: 'app-user-dialog',
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatDialogModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatButtonModule,
    MatIconModule,
    MatProgressSpinnerModule
  ],
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data.user ? 'Editar Usuário' : 'Novo Usuário' }}</h2>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="dialog-content">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome Completo</mat-label>
            <input matInput formControlName="name" placeholder="Ex: João Silva">
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="form.get('name')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Email</mat-label>
            <input matInput type="email" formControlName="email" placeholder="usuario@email.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              Email é obrigatório
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Email inválido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>{{ data.user ? 'Nova Senha (deixe em branco para não alterar)' : 'Senha' }}</mat-label>
            <input matInput [type]="hidePassword ? 'password' : 'text'" formControlName="password" [placeholder]="data.user ? 'Digite apenas se quiser alterar' : 'Mínimo 6 caracteres'">
            <mat-icon matPrefix>lock</mat-icon>
            <button mat-icon-button matSuffix (click)="hidePassword = !hidePassword" type="button">
              <mat-icon>{{ hidePassword ? 'visibility_off' : 'visibility' }}</mat-icon>
            </button>
            <mat-error *ngIf="form.get('password')?.hasError('required')">
              Senha é obrigatória
            </mat-error>
            <mat-error *ngIf="form.get('password')?.hasError('minlength')">
              Senha deve ter no mínimo 6 caracteres
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Perfil de Acesso</mat-label>
            <mat-select formControlName="role" (selectionChange)="onRoleChange($event.value)">
              <mat-option value="admin">Administrador</mat-option>
              <mat-option value="manager">Gerente</mat-option>
              <mat-option value="seller">Vendedor</mat-option>
              <mat-option value="cashier">Caixa</mat-option>
            </mat-select>
            <mat-icon matPrefix>badge</mat-icon>
            <mat-error *ngIf="form.get('role')?.hasError('required')">
              Perfil é obrigatório
            </mat-error>
          </mat-form-field>

          <div class="permissions-section">
            <h3>Permissões de Acesso</h3>
            <div class="permissions-grid">
              <mat-checkbox formControlName="dashboard">Dashboard</mat-checkbox>
              <mat-checkbox formControlName="products">Produtos</mat-checkbox>
              <mat-checkbox formControlName="clients">Clientes</mat-checkbox>
              <mat-checkbox formControlName="sales">Vendas</mat-checkbox>
              <mat-checkbox formControlName="pdv">PDV</mat-checkbox>
              <mat-checkbox formControlName="reports">Relatórios</mat-checkbox>
              <mat-checkbox formControlName="stock">Estoque</mat-checkbox>
              <mat-checkbox formControlName="financial">Financeiro</mat-checkbox>
              <mat-checkbox formControlName="users">Usuários</mat-checkbox>
              <mat-checkbox formControlName="settings">Configurações</mat-checkbox>
            </div>
          </div>

          <mat-slide-toggle formControlName="active" class="full-width">
            Usuário Ativo
          </mat-slide-toggle>
        </div>

        <div class="dialog-footer">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">{{ data.user ? 'Salvar' : 'Criar Usuário' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .permissions-section {
      margin: 1.5rem 0;
      padding: 1rem;
      border: 1px solid hsl(var(--border));
      border-radius: 8px;
      background: hsl(var(--muted) / 0.1);

      h3 {
        margin: 0 0 1rem 0;
        font-size: 0.9rem;
        font-weight: 600;
        color: hsl(var(--foreground));
      }

      .permissions-grid {
        display: grid;
        grid-template-columns: repeat(2, 1fr);
        gap: 0.75rem;

        mat-checkbox {
          font-size: 0.875rem;
        }
      }
    }

    mat-slide-toggle {
      margin-top: 1rem;
    }
  `]
})
export class UserDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;
  hidePassword = true;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<UserDialogComponent>,
    private userService: UserManagementService,
    @Inject(MAT_DIALOG_DATA) public data: { user?: User }
  ) {
    const user = this.data.user;
    const permissions = user?.permissions || this.userService.getDefaultPermissions('cashier');

    this.form = this.fb.group({
      name: [user?.name || '', Validators.required],
      email: [user?.email || '', [Validators.required, Validators.email]],
      password: ['', user ? [Validators.minLength(6)] : [Validators.required, Validators.minLength(6)]],
      role: [user?.role || 'cashier', Validators.required],
      active: [user?.active !== false],
      // Permissões
      dashboard: [permissions.dashboard],
      products: [permissions.products],
      clients: [permissions.clients],
      sales: [permissions.sales],
      pdv: [permissions.pdv],
      reports: [permissions.reports],
      stock: [permissions.stock],
      financial: [permissions.financial],
      users: [permissions.users],
      settings: [permissions.settings]
    });
  }

  ngOnInit(): void {}

  onRoleChange(role: UserRole): void {
    const defaultPermissions = this.userService.getDefaultPermissions(role);
    this.form.patchValue(defaultPermissions);
  }

  onSubmit(): void {
    if (this.form.valid) {
      const formValue = this.form.value;
      const permissions: UserPermissions = {
        dashboard: formValue.dashboard,
        products: formValue.products,
        clients: formValue.clients,
        sales: formValue.sales,
        pdv: formValue.pdv,
        reports: formValue.reports,
        stock: formValue.stock,
        financial: formValue.financial,
        users: formValue.users,
        settings: formValue.settings
      };

      const userData: any = {
        name: formValue.name,
        email: formValue.email,
        role: formValue.role,
        permissions,
        active: formValue.active
      };

      // Só incluir senha se foi preenchida
      if (formValue.password && formValue.password.trim() !== '') {
        userData.password = formValue.password;
      }

      this.dialogRef.close(userData);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
