import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Product, Category } from '../../models';

@Component({
  selector: 'app-product-dialog',
  styles: [`
    .image-upload-section {
      margin-top: 1rem;
      
      .image-label {
        display: block;
        font-size: 0.875rem;
        font-weight: 500;
        margin-bottom: 0.75rem;
        color: hsl(var(--foreground));
      }

      .image-preview-container {
        position: relative;
        width: 200px;
        height: 200px;
        border: 2px solid hsl(var(--border));
        border-radius: 8px;
        overflow: hidden;
        margin-bottom: 1rem;

        .image-preview {
          width: 100%;
          height: 100%;
          object-fit: cover;
        }

        .remove-image-btn {
          position: absolute;
          top: 0.5rem;
          right: 0.5rem;
          background: rgba(0, 0, 0, 0.7);
          color: white;

          &:hover {
            background: rgba(0, 0, 0, 0.9);
          }
        }
      }

      .upload-area {
        display: flex;
        flex-direction: column;
        align-items: center;
        gap: 0.5rem;
        padding: 2rem;
        border: 2px dashed hsl(var(--border));
        border-radius: 8px;
        background: hsl(var(--muted) / 0.1);

        button {
          mat-icon {
            margin-right: 0.5rem;
          }
        }

        .upload-hint {
          margin: 0;
          font-size: 0.75rem;
          color: hsl(var(--muted-foreground));
        }
      }
    }
  `],
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

          <!-- Upload de Imagem -->
          <div class="image-upload-section">
            <label class="image-label">Foto do Produto</label>
            
            <div class="image-preview-container" *ngIf="imagePreview">
              <img [src]="imagePreview" alt="Preview" class="image-preview">
              <button mat-icon-button class="remove-image-btn" type="button" (click)="removeImage()">
                <mat-icon>close</mat-icon>
              </button>
            </div>

            <div class="upload-area" *ngIf="!imagePreview">
              <input type="file" #fileInput accept="image/*" (change)="onFileSelected($event)" style="display: none">
              <button mat-stroked-button type="button" (click)="fileInput.click()">
                <mat-icon>add_photo_alternate</mat-icon>
                Adicionar Foto
              </button>
              <p class="upload-hint">PNG, JPG ou JPEG (máx. 2MB)</p>
            </div>
          </div>
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
  imagePreview: string | null = null;

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
      description: [''],
      imageUrl: ['']
    });
  }

  ngOnInit(): void {
    if (this.data.product) {
      this.form.patchValue(this.data.product);
      if (this.data.product.imageUrl) {
        this.imagePreview = this.data.product.imageUrl;
      }
    }
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      // Validar tamanho (max 2MB)
      if (file.size > 2 * 1024 * 1024) {
        alert('A imagem deve ter no máximo 2MB');
        return;
      }

      // Validar tipo
      if (!file.type.startsWith('image/')) {
        alert('Apenas imagens são permitidas');
        return;
      }

      const reader = new FileReader();
      reader.onload = (e: any) => {
        this.imagePreview = e.target.result;
        this.form.patchValue({ imageUrl: e.target.result });
      };
      reader.readAsDataURL(file);
    }
  }

  removeImage(): void {
    this.imagePreview = null;
    this.form.patchValue({ imageUrl: '' });
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
