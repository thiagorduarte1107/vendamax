import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, tap } from 'rxjs/operators';
import { User, LoginCredentials } from '../models';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private currentUserSubject = new BehaviorSubject<User | null>(null);
  public currentUser$ = this.currentUserSubject.asObservable();
  private isAuthenticatedSubject = new BehaviorSubject<boolean>(false);
  public isAuthenticated$ = this.isAuthenticatedSubject.asObservable();

  constructor() {
    // Check if user is already logged in
    const storedUser = localStorage.getItem('currentUser');
    if (storedUser) {
      const user = JSON.parse(storedUser);
      // Garantir que o usuário tenha todas as propriedades necessárias
      if (user && !user.permissions) {
        // Usuário antigo, fazer logout
        localStorage.removeItem('currentUser');
      } else {
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      }
    }
  }

  login(credentials: LoginCredentials): Observable<User> {
    // Mock login - aceita qualquer email/senha
    const mockUser: User = {
      id: '1',
      name: 'Usuário Demo',
      email: credentials.email,
      role: 'admin',
      permissions: {
        dashboard: true,
        products: true,
        clients: true,
        sales: true,
        pdv: true,
        reports: true,
        stock: true,
        financial: true,
        users: true,
        settings: true
      },
      active: true,
      createdAt: new Date(),
      updatedAt: new Date()
    };

    return of(mockUser).pipe(
      delay(500), // Simula latência de rede
      tap(user => {
        localStorage.setItem('currentUser', JSON.stringify(user));
        this.currentUserSubject.next(user);
        this.isAuthenticatedSubject.next(true);
      })
    );
  }

  logout(): void {
    localStorage.removeItem('currentUser');
    this.currentUserSubject.next(null);
    this.isAuthenticatedSubject.next(false);
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  isAuthenticated(): boolean {
    return this.isAuthenticatedSubject.value;
  }
}
