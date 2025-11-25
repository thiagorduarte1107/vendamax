import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { AccountReceivable, AccountPayable, AccountFilters } from '../models';
import { mockAccountsReceivable, mockAccountsPayable, mockClients } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class AccountService {
  private receivablesSubject = new BehaviorSubject<AccountReceivable[]>([...mockAccountsReceivable]);
  public receivables$ = this.receivablesSubject.asObservable();

  private payablesSubject = new BehaviorSubject<AccountPayable[]>([...mockAccountsPayable]);
  public payables$ = this.payablesSubject.asObservable();

  constructor() {}

  // Accounts Receivable
  getAllReceivables(filters?: AccountFilters): Observable<AccountReceivable[]> {
    return this.receivables$.pipe(
      map(accounts => {
        let filtered = [...accounts];

        // Adiciona cliente
        filtered = filtered.map(a => ({
          ...a,
          client: mockClients.find(c => c.id === a.clientId)
        }));

        // Atualiza status baseado na data de vencimento
        filtered = filtered.map(a => {
          if (a.status === 'pending' && new Date(a.dueDate) < new Date()) {
            return { ...a, status: 'overdue' as const };
          }
          return a;
        });

        if (filters) {
          if (filters.clientId) {
            filtered = filtered.filter(a => a.clientId === filters.clientId);
          }

          if (filters.status) {
            filtered = filtered.filter(a => a.status === filters.status);
          }

          if (filters.startDate) {
            filtered = filtered.filter(a => new Date(a.dueDate) >= filters.startDate!);
          }

          if (filters.endDate) {
            filtered = filtered.filter(a => new Date(a.dueDate) <= filters.endDate!);
          }
        }

        return filtered.sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      }),
      delay(300)
    );
  }

  getReceivableById(id: string): Observable<AccountReceivable | undefined> {
    return this.receivables$.pipe(
      map(accounts => {
        const account = accounts.find(a => a.id === id);
        if (account) {
          return {
            ...account,
            client: mockClients.find(c => c.id === account.clientId)
          };
        }
        return undefined;
      }),
      delay(200)
    );
  }

  createReceivable(account: Omit<AccountReceivable, 'id' | 'createdAt'>): Observable<AccountReceivable> {
    const newAccount: AccountReceivable = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentAccounts = this.receivablesSubject.value;
    this.receivablesSubject.next([...currentAccounts, newAccount]);

    return of(newAccount).pipe(delay(300));
  }

  updateReceivable(id: string, account: Partial<AccountReceivable>): Observable<AccountReceivable> {
    const currentAccounts = this.receivablesSubject.value;
    const index = currentAccounts.findIndex(a => a.id === id);

    if (index !== -1) {
      const updatedAccount = {
        ...currentAccounts[index],
        ...account
      };

      const newAccounts = [...currentAccounts];
      newAccounts[index] = updatedAccount;
      this.receivablesSubject.next(newAccounts);

      return of(updatedAccount).pipe(delay(300));
    }

    throw new Error('Account not found');
  }

  deleteReceivable(id: string): Observable<boolean> {
    const currentAccounts = this.receivablesSubject.value;
    const filtered = currentAccounts.filter(a => a.id !== id);
    this.receivablesSubject.next(filtered);

    return of(true).pipe(delay(300));
  }

  markReceivableAsPaid(id: string): Observable<AccountReceivable> {
    return this.updateReceivable(id, {
      status: 'paid',
      paidAt: new Date()
    });
  }

  // Accounts Payable
  getAllPayables(filters?: AccountFilters): Observable<AccountPayable[]> {
    return this.payables$.pipe(
      map(accounts => {
        let filtered = [...accounts];

        // Atualiza status baseado na data de vencimento
        filtered = filtered.map(a => {
          if (a.status === 'pending' && new Date(a.dueDate) < new Date()) {
            return { ...a, status: 'overdue' as const };
          }
          return a;
        });

        if (filters) {
          if (filters.status) {
            filtered = filtered.filter(a => a.status === filters.status);
          }

          if (filters.startDate) {
            filtered = filtered.filter(a => new Date(a.dueDate) >= filters.startDate!);
          }

          if (filters.endDate) {
            filtered = filtered.filter(a => new Date(a.dueDate) <= filters.endDate!);
          }
        }

        return filtered.sort((a, b) => 
          new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
        );
      }),
      delay(300)
    );
  }

  getPayableById(id: string): Observable<AccountPayable | undefined> {
    return this.payables$.pipe(
      map(accounts => accounts.find(a => a.id === id)),
      delay(200)
    );
  }

  createPayable(account: Omit<AccountPayable, 'id' | 'createdAt'>): Observable<AccountPayable> {
    const newAccount: AccountPayable = {
      ...account,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentAccounts = this.payablesSubject.value;
    this.payablesSubject.next([...currentAccounts, newAccount]);

    return of(newAccount).pipe(delay(300));
  }

  updatePayable(id: string, account: Partial<AccountPayable>): Observable<AccountPayable> {
    const currentAccounts = this.payablesSubject.value;
    const index = currentAccounts.findIndex(a => a.id === id);

    if (index !== -1) {
      const updatedAccount = {
        ...currentAccounts[index],
        ...account
      };

      const newAccounts = [...currentAccounts];
      newAccounts[index] = updatedAccount;
      this.payablesSubject.next(newAccounts);

      return of(updatedAccount).pipe(delay(300));
    }

    throw new Error('Account not found');
  }

  deletePayable(id: string): Observable<boolean> {
    const currentAccounts = this.payablesSubject.value;
    const filtered = currentAccounts.filter(a => a.id !== id);
    this.payablesSubject.next(filtered);

    return of(true).pipe(delay(300));
  }

  markPayableAsPaid(id: string): Observable<AccountPayable> {
    return this.updatePayable(id, {
      status: 'paid',
      paidAt: new Date()
    });
  }

  getTotalExpenses(): Observable<number> {
    return this.payables$.pipe(
      map(accounts => 
        accounts
          .filter(a => a.status === 'paid')
          .reduce((sum, account) => sum + account.amount, 0)
      ),
      delay(200)
    );
  }
}
