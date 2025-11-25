import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Category } from '../models';
import { mockCategories } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class CategoryService {
  private categoriesSubject = new BehaviorSubject<Category[]>([...mockCategories]);
  public categories$ = this.categoriesSubject.asObservable();

  constructor() {}

  getAll(): Observable<Category[]> {
    return this.categories$.pipe(delay(200));
  }

  getById(id: string): Observable<Category | undefined> {
    return this.categories$.pipe(
      map(categories => categories.find(c => c.id === id)),
      delay(200)
    );
  }

  create(category: Omit<Category, 'id' | 'createdAt'>): Observable<Category> {
    const newCategory: Category = {
      ...category,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentCategories = this.categoriesSubject.value;
    this.categoriesSubject.next([...currentCategories, newCategory]);

    return of(newCategory).pipe(delay(300));
  }

  update(id: string, category: Partial<Category>): Observable<Category> {
    const currentCategories = this.categoriesSubject.value;
    const index = currentCategories.findIndex(c => c.id === id);

    if (index !== -1) {
      const updatedCategory = {
        ...currentCategories[index],
        ...category
      };

      const newCategories = [...currentCategories];
      newCategories[index] = updatedCategory;
      this.categoriesSubject.next(newCategories);

      return of(updatedCategory).pipe(delay(300));
    }

    throw new Error('Category not found');
  }

  delete(id: string): Observable<boolean> {
    const currentCategories = this.categoriesSubject.value;
    const filtered = currentCategories.filter(c => c.id !== id);
    this.categoriesSubject.next(filtered);

    return of(true).pipe(delay(300));
  }
}
