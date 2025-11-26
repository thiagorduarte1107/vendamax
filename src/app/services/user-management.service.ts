import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { User, UserRole, UserPermissions, UserActivity } from '../models';

@Injectable({
  providedIn: 'root'
})
export class UserManagementService {
  private usersSubject = new BehaviorSubject<User[]>(this.loadUsers());
  public users$ = this.usersSubject.asObservable();

  private activitiesSubject = new BehaviorSubject<UserActivity[]>(this.loadActivities());
  public activities$ = this.activitiesSubject.asObservable();

  constructor() {}

  // Carregar usuários do localStorage
  private loadUsers(): User[] {
    const stored = localStorage.getItem('users');
    if (stored) {
      return JSON.parse(stored, (key, value) => {
        if (key === 'createdAt' || key === 'updatedAt' || key === 'lastLogin') {
          return value ? new Date(value) : undefined;
        }
        return value;
      });
    }
    return this.getDefaultUsers();
  }

  // Usuários padrão do sistema
  private getDefaultUsers(): User[] {
    return [
      {
        id: '1',
        name: 'Administrador',
        email: 'admin@vendamax.com',
        role: 'admin',
        permissions: this.getFullPermissions(),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '2',
        name: 'Gerente',
        email: 'gerente@vendamax.com',
        role: 'manager',
        permissions: this.getManagerPermissions(),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '3',
        name: 'Vendedor',
        email: 'vendedor@vendamax.com',
        role: 'seller',
        permissions: this.getSellerPermissions(),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      },
      {
        id: '4',
        name: 'Caixa',
        email: 'caixa@vendamax.com',
        role: 'cashier',
        permissions: this.getCashierPermissions(),
        active: true,
        createdAt: new Date(),
        updatedAt: new Date()
      }
    ];
  }

  // Permissões completas (Admin)
  private getFullPermissions(): UserPermissions {
    return {
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
    };
  }

  // Permissões de Gerente
  private getManagerPermissions(): UserPermissions {
    return {
      dashboard: true,
      products: true,
      clients: true,
      sales: true,
      pdv: true,
      reports: true,
      stock: true,
      financial: true,
      users: false,
      settings: false
    };
  }

  // Permissões de Vendedor
  private getSellerPermissions(): UserPermissions {
    return {
      dashboard: true,
      products: false,
      clients: true,
      sales: true,
      pdv: true,
      reports: false,
      stock: false,
      financial: false,
      users: false,
      settings: false
    };
  }

  // Permissões de Caixa
  private getCashierPermissions(): UserPermissions {
    return {
      dashboard: false,
      products: false,
      clients: false,
      sales: true,
      pdv: true,
      reports: false,
      stock: false,
      financial: false,
      users: false,
      settings: false
    };
  }

  // Salvar usuários no localStorage
  private saveUsers(users: User[]): void {
    localStorage.setItem('users', JSON.stringify(users));
    this.usersSubject.next(users);
  }

  // Obter todos os usuários
  getAll(): Observable<User[]> {
    return this.users$.pipe(delay(200));
  }

  // Obter usuário por ID
  getById(id: string): Observable<User | undefined> {
    return this.users$.pipe(
      map(users => users.find(u => u.id === id)),
      delay(200)
    );
  }

  // Criar novo usuário
  create(user: Omit<User, 'id' | 'createdAt' | 'updatedAt'>): Observable<User> {
    const newUser: User = {
      ...user,
      id: Date.now().toString(),
      createdAt: new Date(),
      updatedAt: new Date()
    };

    const currentUsers = this.usersSubject.value;
    this.saveUsers([...currentUsers, newUser]);

    this.logActivity(newUser.id, 'create', 'users', `Usuário ${newUser.name} criado`);

    return of(newUser).pipe(delay(300));
  }

  // Atualizar usuário
  update(id: string, user: Partial<User>): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === id);

    if (index !== -1) {
      const updatedUser = {
        ...currentUsers[index],
        ...user,
        updatedAt: new Date()
      };

      const newUsers = [...currentUsers];
      newUsers[index] = updatedUser;
      this.saveUsers(newUsers);

      this.logActivity(id, 'update', 'users', `Usuário ${updatedUser.name} atualizado`);

      return of(updatedUser).pipe(delay(300));
    }

    throw new Error('Usuário não encontrado');
  }

  // Deletar usuário
  delete(id: string): Observable<boolean> {
    const currentUsers = this.usersSubject.value;
    const user = currentUsers.find(u => u.id === id);
    
    if (user) {
      const filtered = currentUsers.filter(u => u.id !== id);
      this.saveUsers(filtered);

      this.logActivity(id, 'delete', 'users', `Usuário ${user.name} deletado`);

      return of(true).pipe(delay(300));
    }

    return of(false).pipe(delay(300));
  }

  // Ativar/Desativar usuário
  toggleActive(id: string): Observable<User> {
    const currentUsers = this.usersSubject.value;
    const index = currentUsers.findIndex(u => u.id === id);

    if (index !== -1) {
      const updatedUser = {
        ...currentUsers[index],
        active: !currentUsers[index].active,
        updatedAt: new Date()
      };

      const newUsers = [...currentUsers];
      newUsers[index] = updatedUser;
      this.saveUsers(newUsers);

      const action = updatedUser.active ? 'ativado' : 'desativado';
      this.logActivity(id, 'toggle', 'users', `Usuário ${updatedUser.name} ${action}`);

      return of(updatedUser).pipe(delay(300));
    }

    throw new Error('Usuário não encontrado');
  }

  // Atualizar permissões
  updatePermissions(id: string, permissions: UserPermissions): Observable<User> {
    return this.update(id, { permissions });
  }

  // Obter permissões padrão por role
  getDefaultPermissions(role: UserRole): UserPermissions {
    switch (role) {
      case 'admin':
        return this.getFullPermissions();
      case 'manager':
        return this.getManagerPermissions();
      case 'seller':
        return this.getSellerPermissions();
      case 'cashier':
        return this.getCashierPermissions();
      default:
        return this.getCashierPermissions();
    }
  }

  // Log de atividades
  private loadActivities(): UserActivity[] {
    const stored = localStorage.getItem('userActivities');
    if (stored) {
      return JSON.parse(stored, (key, value) => {
        if (key === 'createdAt') {
          return new Date(value);
        }
        return value;
      });
    }
    return [];
  }

  private saveActivities(activities: UserActivity[]): void {
    // Manter apenas as últimas 100 atividades
    const limited = activities.slice(-100);
    localStorage.setItem('userActivities', JSON.stringify(limited));
    this.activitiesSubject.next(limited);
  }

  logActivity(userId: string, action: string, module: string, description: string): void {
    const activity: UserActivity = {
      id: Date.now().toString(),
      userId,
      action,
      module,
      description,
      createdAt: new Date()
    };

    const currentActivities = this.activitiesSubject.value;
    this.saveActivities([...currentActivities, activity]);
  }

  // Obter atividades
  getActivities(userId?: string): Observable<UserActivity[]> {
    return this.activities$.pipe(
      map(activities => {
        if (userId) {
          return activities.filter(a => a.userId === userId);
        }
        return activities;
      }),
      delay(200)
    );
  }

  // Obter atividades recentes
  getRecentActivities(limit: number = 10): Observable<UserActivity[]> {
    return this.activities$.pipe(
      map(activities => activities.slice(-limit).reverse()),
      delay(200)
    );
  }
}
