import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Client } from '../../models';

@Component({
  selector: 'app-client-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data ? 'Editar Cliente' : 'Novo Cliente' }}</h2>
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
            <input matInput type="email" formControlName="email" placeholder="joao@email.com">
            <mat-icon matPrefix>email</mat-icon>
            <mat-error *ngIf="form.get('email')?.hasError('required')">
              Email é obrigatório
            </mat-error>
            <mat-error *ngIf="form.get('email')?.hasError('email')">
              Email inválido
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Telefone</mat-label>
            <input matInput formControlName="phone" placeholder="(11) 99999-9999">
            <mat-icon matPrefix>phone</mat-icon>
            <mat-error *ngIf="form.get('phone')?.hasError('required')">
              Telefone é obrigatório
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Limite de Crédito</mat-label>
              <input matInput type="text" formControlName="creditLimit" placeholder="R$ 0,00" currencyMask>
              <mat-error *ngIf="form.get('creditLimit')?.hasError('min')">
                Limite não pode ser negativo
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Dívida Atual</mat-label>
              <input matInput type="text" formControlName="currentDebt" placeholder="R$ 0,00" currencyMask [readonly]="!data">
              <mat-hint *ngIf="!data">Calculado automaticamente</mat-hint>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Endereço (opcional)</mat-label>
            <textarea matInput formControlName="address" rows="2" placeholder="Rua, número, bairro, cidade"></textarea>
            <mat-icon matPrefix>location_on</mat-icon>
          </mat-form-field>
        </div>

        <div class="dialog-footer">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">{{ data ? 'Salvar' : 'Criar Cliente' }}</span>
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
export class ClientDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ClientDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Client | null
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      phone: ['', Validators.required],
      creditLimit: [0, Validators.min(0)],
      currentDebt: [0],
      address: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
    } else {
      this.form.get('currentDebt')?.disable();
    }
  }

  onSubmit(): void {
    if (this.form.valid) {
      this.dialogRef.close(this.form.getRawValue());
    }
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
