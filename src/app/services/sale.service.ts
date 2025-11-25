import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Sale, SaleFilters } from '../models';
import { mockSales, mockClients, mockProducts } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class SaleService {
  private salesSubject = new BehaviorSubject<Sale[]>([...mockSales]);
  public sales$ = this.salesSubject.asObservable();

  constructor() {}

  getAll(filters?: SaleFilters): Observable<Sale[]> {
    return this.sales$.pipe(
      map(sales => {
        let filtered = [...sales];

        // Adiciona cliente e produtos aos itens
        filtered = filtered.map(s => ({
          ...s,
          client: mockClients.find(c => c.id === s.clientId),
          items: s.items.map(item => ({
            ...item,
            product: mockProducts.find(p => p.id === item.productId)
          }))
        }));

        if (filters) {
          if (filters.clientId) {
            filtered = filtered.filter(s => s.clientId === filters.clientId);
          }

          if (filters.status) {
            filtered = filtered.filter(s => s.status === filters.status);
          }

          if (filters.paymentMethod) {
            filtered = filtered.filter(s => s.paymentMethod === filters.paymentMethod);
          }

          if (filters.startDate) {
            filtered = filtered.filter(s => new Date(s.createdAt) >= filters.startDate!);
          }

          if (filters.endDate) {
            filtered = filtered.filter(s => new Date(s.createdAt) <= filters.endDate!);
          }
        }

        return filtered.sort((a, b) => 
          new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
        );
      }),
      delay(300)
    );
  }

  getById(id: string): Observable<Sale | undefined> {
    return this.sales$.pipe(
      map(sales => {
        const sale = sales.find(s => s.id === id);
        if (sale) {
          return {
            ...sale,
            client: mockClients.find(c => c.id === sale.clientId),
            items: sale.items.map(item => ({
              ...item,
              product: mockProducts.find(p => p.id === item.productId)
            }))
          };
        }
        return undefined;
      }),
      delay(200)
    );
  }

  create(sale: Omit<Sale, 'id' | 'createdAt'>): Observable<Sale> {
    const newSale: Sale = {
      ...sale,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentSales = this.salesSubject.value;
    this.salesSubject.next([...currentSales, newSale]);

    return of(newSale).pipe(delay(300));
  }

  update(id: string, sale: Partial<Sale>): Observable<Sale> {
    const currentSales = this.salesSubject.value;
    const index = currentSales.findIndex(s => s.id === id);

    if (index !== -1) {
      const updatedSale = {
        ...currentSales[index],
        ...sale
      };

      const newSales = [...currentSales];
      newSales[index] = updatedSale;
      this.salesSubject.next(newSales);

      return of(updatedSale).pipe(delay(300));
    }

    throw new Error('Sale not found');
  }

  delete(id: string): Observable<boolean> {
    const currentSales = this.salesSubject.value;
    const filtered = currentSales.filter(s => s.id !== id);
    this.salesSubject.next(filtered);

    return of(true).pipe(delay(300));
  }

  getTotalSales(): Observable<number> {
    return this.sales$.pipe(
      map(sales => sales.filter(s => s.status === 'completed').length),
      delay(200)
    );
  }

  getTotalRevenue(): Observable<number> {
    return this.sales$.pipe(
      map(sales => 
        sales
          .filter(s => s.status === 'completed')
          .reduce((sum, sale) => sum + sale.total, 0)
      ),
      delay(200)
    );
  }
}
