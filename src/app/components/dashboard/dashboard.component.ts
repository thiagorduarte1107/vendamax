import { Component, OnInit } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ProductService } from '../../services/product.service';
import { DashboardMetrics, Product } from '../../models';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  metrics: DashboardMetrics | null = null;
  lowStockProducts: Product[] = [];
  loading = true;


  constructor(
    private dashboardService: DashboardService,
    private productService: ProductService
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.loading = true;

    this.dashboardService.getMetrics().subscribe({
      next: (metrics) => {
        this.metrics = metrics;
        this.loading = false;
      },
      error: (err) => {
        console.error('Erro ao carregar métricas:', err);
        this.loading = false;
      }
    });

    this.productService.getLowStockProducts().subscribe({
      next: (products) => {
        this.lowStockProducts = products;
      },
      error: (err) => {
        console.error('Erro ao carregar produtos:', err);
      }
    });
  }


  formatCurrency(value: number): string {
    return value.toLocaleString('pt-BR', {
      style: 'currency',
      currency: 'BRL'
    });
  }
}
