import { Component, Inject, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { Category } from '../../models';

@Component({
  selector: 'app-category-dialog',
  template: `
    <div class="dialog-container">
      <div class="dialog-header">
        <h2>{{ data ? 'Editar Categoria' : 'Nova Categoria' }}</h2>
        <button mat-icon-button (click)="onCancel()">
          <mat-icon>close</mat-icon>
        </button>
      </div>

      <form [formGroup]="form" (ngSubmit)="onSubmit()">
        <div class="dialog-content">
          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Nome da Categoria</mat-label>
            <input matInput formControlName="name" placeholder="Ex: Bebidas">
            <mat-icon matPrefix>category</mat-icon>
            <mat-error *ngIf="form.get('name')?.hasError('required')">
              Nome é obrigatório
            </mat-error>
          </mat-form-field>

          <mat-form-field appearance="outline" class="full-width">
            <mat-label>Descrição (opcional)</mat-label>
            <textarea matInput formControlName="description" rows="3" placeholder="Descrição da categoria"></textarea>
          </mat-form-field>
        </div>

        <div class="dialog-footer">
          <button mat-button type="button" (click)="onCancel()">
            Cancelar
          </button>
          <button mat-raised-button color="primary" type="submit" [disabled]="form.invalid || loading">
            <mat-spinner *ngIf="loading" diameter="20"></mat-spinner>
            <span *ngIf="!loading">{{ data ? 'Salvar' : 'Criar Categoria' }}</span>
          </button>
        </div>
      </form>
    </div>
  `,
  styles: [`
    .dialog-container {
      width: 500px;
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
    }

    .full-width {
      width: 100%;
      margin-bottom: 1rem;
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
export class CategoryDialogComponent implements OnInit {
  form: FormGroup;
  loading = false;

  constructor(
    private fb: FormBuilder,
    private dialogRef: MatDialogRef<CategoryDialogComponent>,
    @Inject(MAT_DIALOG_DATA) public data: Category | null
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      description: ['']
    });
  }

  ngOnInit(): void {
    if (this.data) {
      this.form.patchValue(this.data);
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
