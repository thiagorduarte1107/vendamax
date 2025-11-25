import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Product, ProductFilters } from '../models';
import { mockProducts, mockCategories } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private productsSubject = new BehaviorSubject<Product[]>([...mockProducts]);
  public products$ = this.productsSubject.asObservable();

  constructor() {}

  getAll(filters?: ProductFilters): Observable<Product[]> {
    return this.products$.pipe(
      map(products => {
        let filtered = [...products];

        // Adiciona categoria aos produtos
        filtered = filtered.map(p => ({
          ...p,
          category: mockCategories.find(c => c.id === p.categoryId)
        }));

        if (filters) {
          if (filters.search) {
            const search = filters.search.toLowerCase();
            filtered = filtered.filter(p =>
              p.name.toLowerCase().includes(search) ||
              p.description.toLowerCase().includes(search)
            );
          }

          if (filters.categoryId) {
            filtered = filtered.filter(p => p.categoryId === filters.categoryId);
          }

          if (filters.minPrice !== undefined) {
            filtered = filtered.filter(p => p.price >= filters.minPrice!);
          }

          if (filters.maxPrice !== undefined) {
            filtered = filtered.filter(p => p.price <= filters.maxPrice!);
          }

          if (filters.lowStock) {
            filtered = filtered.filter(p => p.stock <= p.minStock);
          }
        }

        return filtered;
      }),
      delay(300)
    );
  }

  getById(id: string): Observable<Product | undefined> {
    return this.products$.pipe(
      map(products => {
        const product = products.find(p => p.id === id);
        if (product) {
          return {
            ...product,
            category: mockCategories.find(c => c.id === product.categoryId)
          };
        }
        return undefined;
      }),
      delay(200)
    );
  }

  create(product: Omit<Product, 'id' | 'createdAt' | 'updatedAt'>): Observable<Product> {
    const newProduct: Product = {
      ...product,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentProducts = this.productsSubject.value;
    this.productsSubject.next([...currentProducts, newProduct]);

    return of(newProduct).pipe(delay(300));
  }

  update(id: string, product: Partial<Product>): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === id);

    if (index !== -1) {
      const updatedProduct = {
        ...currentProducts[index],
        ...product,
        updatedAt: new Date()
      };

      const newProducts = [...currentProducts];
      newProducts[index] = updatedProduct;
      this.productsSubject.next(newProducts);

      return of(updatedProduct).pipe(delay(300));
    }

    throw new Error('Product not found');
  }

  delete(id: string): Observable<boolean> {
    const currentProducts = this.productsSubject.value;
    const filtered = currentProducts.filter(p => p.id !== id);
    this.productsSubject.next(filtered);

    return of(true).pipe(delay(300));
  }

  getLowStockProducts(): Observable<Product[]> {
    return this.products$.pipe(
      map(products => products.filter(p => p.stock <= p.minStock)),
      delay(200)
    );
  }

  updateStock(id: string, quantity: number): Observable<Product> {
    const currentProducts = this.productsSubject.value;
    const index = currentProducts.findIndex(p => p.id === id);

    if (index !== -1) {
      const updatedProduct = {
        ...currentProducts[index],
        stock: currentProducts[index].stock + quantity,
        updatedAt: new Date()
      };

      const newProducts = [...currentProducts];
      newProducts[index] = updatedProduct;
      this.productsSubject.next(newProducts);

      return of(updatedProduct).pipe(delay(200));
    }

    throw new Error('Product not found');
  }
}
