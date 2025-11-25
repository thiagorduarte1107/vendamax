import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-product-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data.product ? 'Editar Produto' : 'Novo Produto' }}</h2>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="dialog-content">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome do Produto</mat-label>
            <input matInput formControlName="name" placeholder="Ex: Coca-Cola 2L">
            <mat-icon matPrefix>inventory_2</mat-icon>
            <mat-error *ngIf="form.get('name')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Categoria</mat-label>
            <mat-select formControlName="categoryId">
              <mat-option *ngFor="let category of data.categories" [value]="category.id">
                {{ category.name }}
              </mat-option>
            </mat-select>
            <mat-icon matPrefix>category</mat-icon>
            <mat-error *ngIf="form.get('categoryId')?.hasError('required')">
              Categoria é obrigatória
            </mat-error>
          </mat-form-field>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Preço</mat-label>
              <input matInput type="text" formControlName="price" placeholder="R$ 0,00" currencyMask>
              <mat-error *ngIf="form.get('price')?.hasError('required')">
                Preço é obrigatório
              </mat-error>
              <mat-error *ngIf="form.get('price')?.hasError('min')">
                Preço deve ser maior que zero
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Custo</mat-label>
              <input matInput type="text" formControlName="cost" placeholder="R$ 0,00" currencyMask>
            </mat-form-field>
          </div>

          <div class="form-row">
            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Estoque Atual</mat-label>
              <input matInput type="number" formControlName="stock" placeholder="0">
              <mat-icon matPrefix>inventory</mat-icon>
              <mat-error *ngIf="form.get('stock')?.hasError('required')">
                Estoque é obrigatório
              </mat-error>
              <mat-error *ngIf="form.get('stock')?.hasError('min')">
                Estoque não pode ser negativo
              </mat-error>
            </mat-form-field>

            <mat-form-field appearance="outline" class="half-width">
              <mat-label>Estoque Mínimo</mat-label>
              <input matInput type="number" formControlName="minStock" placeholder="0">
              <mat-icon matPrefix>warning</mat-icon>
              <mat-error *ngIf="form.get('minStock')?.hasError('min')">
                Estoque mínimo não pode ser negativo
              </mat-error>
            </mat-form-field>
          </div>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição (opcional)</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Descrição do produto"></textarea>
          </mat-form-field>
        </div>

        <div class="dialog-footer">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">{{ data.product ? 'Salvar' : 'Criar Produto' }}</span>
          </button>
        </div>
      </form>
    </div>
  `
})
export class ProductDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<ProductDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: { product?: Product; categories: Category[] }
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      categoryId: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0.01)]],
      cost: [0],
      stock: [0, [Validators.required, Validators.min(0)]],
      minStock: [0, Validators.min(0)],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.product) {
      this.form.patchValue(this.data.product);
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
