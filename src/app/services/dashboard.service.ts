import { Injectable } from '@angular/core';
import { Observable, of } from 'rxjs';
import { delay } from 'rxjs/operators';
import { DashboardMetrics } from '../models';
import { mockDashboardMetrics } from '../data/mock-data';

@Injectable({
  providedIn: 'root'
})
export class DashboardService {
  constructor() {}

  getMetrics(): Observable<DashboardMetrics> {
    return of(mockDashboardMetrics).pipe(delay(500));
  }
}
