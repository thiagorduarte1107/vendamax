import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { AccountReceivable, Client } from '../../models';

@Component({
  selector: 'app-account-receivable-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data.account ? 'Editar Conta a Receber' : 'Nova Conta a Receber' }}</h2>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="dialog-content">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Cliente</mat-label>
            <mat-select formControlName="clientId">
              <mat-option *ngFor="let client of data.clients" [value]="client.id">
                {{ client.name }}
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>person</mat-icon>
            <mat-error *ngIf="form.get('clientId')?.hasError('required')">
              Cliente é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição</mat-label>
            <input matInput formControlName="description" placeholder="Ex: Venda #123">
            <mat-icon matPrefix>description</mat-icon>
            <mat-error *ngIf="form.get('description')?.hasError('required')">
              Descrição é obrigatória
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Valor</mat-label>
              <input matInput type="text" formControlName="amount" placeholder="R$ 0,00" currencyMask>
              <mat-error *ngIf="form.get('amount')?.hasError('required')">
                Valor é obrigatório
              </mat-error>
              <mat-error *ngIf="form.get('amount')?.hasError('min')">
                Valor deve ser maior que zero
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Data de Vencimento</mat-label>
              <input matInput type="date" formControlName="dueDate">
              <mat-icon matPrefix>event</mat-icon>
              <mat-error *ngIf="form.get('dueDate')?.hasError('required')">
                Data é obrigatória
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Status</mat-label>
            <mat-select formControlName="status">
              <mat-option value="pending">Pendente</mat-option>
              <mat-option value="paid">Pago</mat-option>
              <mat-option value="overdue">Atrasado</mat-option>
            </mat-select>
            <mat-icon matPrefix>info</mat-icon>
          </mat-form-field>
        </div>

        <div class="dialog-footer">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">{{ data.account ? 'Salvar' : 'Criar Conta' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 600px;
      max-width: 90vw;
    }

    .dialog-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
      padding: 1.5rem;
      border-bottom: 1px solid hsl(var(--border));

      h2 {
        margin: 0;
        font-size: 1.25rem;
        font-weight: 600;
        color: hsl(var(--text-primary));
      }
    }

    .dialog-content {
      padding: 1.5rem;
      max-height: 60vh;
      overflow-y: auto;
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
    }

    .form-row {
      display: grid;
      grid-template-columns: 1fr 1fr;
      gap: 1rem;
      margin-bottom: 1rem;
    }

    .half-width {
      width: 100%;
    }

    .dialog-footer {
      display: flex;
      justify-content: flex-end;
      gap: 0.75rem;
      padding: 1rem 1.5rem;
      border-top: 1px solid hsl(var(--border));
      background: hsl(var(--background-secondary));
    }
  `]
})
export class AccountReceivableDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<AccountReceivableDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { account?: AccountReceivable; clients: Client[] }
  ) {
    this.form = this.fb.group({
      clientId: ['', Validators.required],
      description: ['', Validators.required],
      amount: [0, [Validators.required, Validators.min(0.01)]],
      dueDate: ['', Validators.required],
      status: ['pending', Validators.required]
    });
  }

  ngOnInit(): void {
    if (this.data.account) {
      this.form.patchValue(this.data.account);
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.value);
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
