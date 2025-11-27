import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CategoryService } from '../../services/category.service';
import { Category } from '../../models';
import { CategoryDialogComponent } from './category-dialog.component';
import { ConfirmationService } from '../../services/confirmation.service';

@Component({
  selector: 'app-categories',
  templateUrl: './categories.component.html',
  styleUrls: ['./categories.component.scss']
})
export class CategoriesComponent implements OnInit {
  categories: Category[] = [];
  displayedColumns: string[] = ['name', 'description', 'createdAt', 'actions'];
  loading = true;

  constructor(
    private categoryService: CategoryService,
    private dialog: MatDialog,
    private confirmationService: ConfirmationService
  ) {}

  ngOnInit(): void {
    this.loadCategories();
  }

  loadCategories(): void {
    this.loading = true;
    this.categoryService.getAll().subscribe({
      next: (categories) => {
        this.categories = categories;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar categorias:', err);
        this.loading = false;
      }
    });
  }

  openCategoryDialog(category?: Category): void {
    const dialogRef = this.dialog.open(CategoryDialogComponent, {
      width: '500px',
      data: category || null
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (category) {
          this.categoryService.update(category.id, result).subscribe({
            next: () => this.loadCategories()
          });
        } else {
          this.categoryService.create(result).subscribe({
            next: () => this.loadCategories()
          });
        }
      }
    });
  }

  deleteCategory(id: string): void {
    const category = this.categories.find(c => c.id === id);
    if (!category) return;

    this.confirmationService.confirmDelete(category.name, 'categoria').subscribe(confirmed => {
      if (confirmed) {
        this.categoryService.delete(id).subscribe({
          next: () => {
            this.loadCategories();
          }
        });
      }
    });
  }
}
