import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, of } from 'rxjs';
import { delay, map } from 'rxjs/operators';
import { Client } from '../models';
import { mockClients } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class ClientService {
  private clientsSubject = new BehaviorSubject<Client[]>([...mockClients]);
  public clients$ = this.clientsSubject.asObservable();

  constructor() {}

  getAll(): Observable<Client[]> {
    return this.clients$.pipe(delay(300));
  }

  getById(id: string): Observable<Client | undefined> {
    return this.clients$.pipe(
      map(clients => clients.find(c => c.id === id)),
      delay(200)
    );
  }

  create(client: Omit<Client, 'id' | 'createdAt'>): Observable<Client> {
    const newClient: Client = {
      ...client,
      id: Date.now().toString(),
      createdAt: new Date()
    };

    const currentClients = this.clientsSubject.value;
    this.clientsSubject.next([...currentClients, newClient]);

    return of(newClient).pipe(delay(300));
  }

  update(id: string, client: Partial<Client>): Observable<Client> {
    const currentClients = this.clientsSubject.value;
    const index = currentClients.findIndex(c => c.id === id);

    if (index !== -1) {
      const updatedClient = {
        ...currentClients[index],
        ...client
      };

      const newClients = [...currentClients];
      newClients[index] = updatedClient;
      this.clientsSubject.next(newClients);

      return of(updatedClient).pipe(delay(300));
    }

    throw new Error('Client not found');
  }

  delete(id: string): Observable<boolean> {
    const currentClients = this.clientsSubject.value;
    const filtered = currentClients.filter(c => c.id !== id);
    this.clientsSubject.next(filtered);

    return of(true).pipe(delay(300));
  }

  updateDebt(id: string, amount: number): Observable<Client> {
    const currentClients = this.clientsSubject.value;
    const index = currentClients.findIndex(c => c.id === id);

    if (index !== -1) {
      const updatedClient = {
        ...currentClients[index],
        currentDebt: currentClients[index].currentDebt + amount
      };

      const newClients = [...currentClients];
      newClients[index] = updatedClient;
      this.clientsSubject.next(newClients);

      return of(updatedClient).pipe(delay(200));
    }

    throw new Error('Client not found');
  }
}
