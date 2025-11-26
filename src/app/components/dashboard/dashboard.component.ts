import { Component, OnInit, ViewChild } from '@angular/core';
import { DashboardService } from '../../services/dashboard.service';
import { ProductService } from '../../services/product.service';
import { DashboardMetrics, Product } from '../../models';
import { ChartConfiguration, ChartData, ChartType } from 'chart.js';
import { BaseChartDirective } from 'ng2-charts';
import jsPDF from 'jspdf';

export type PeriodFilter = 'today' | 'week' | 'month' | 'quarter' | 'year' | 'custom';

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.scss']
})
export class DashboardComponent implements OnInit {
  @ViewChild(BaseChartDirective) chart?: BaseChartDirective;
  
  metrics: DashboardMetrics | null = null;
  previousMetrics: DashboardMetrics | null = null;
  lowStockProducts: Product[] = [];
  loading = true;

  // Filtros de período
  selectedPeriod: PeriodFilter = 'month';
  customStartDate: Date | null = null;
  customEndDate: Date | null = null;
  showComparison = false;

  // Gráfico de Vendas por Período (Linha)
  public salesChartData: ChartData<'line'> = {
    labels: ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun'],
    datasets: [
      {
        data: [12500, 15800, 18200, 22100, 19500, 25300],
        label: 'Vendas (R$)',
        fill: true,
        tension: 0.4,
        borderColor: '#000',
        backgroundColor: 'rgba(0, 0, 0, 0.1)'
      }
    ]
  };

  public salesChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'top' }
    }
  };

  public salesChartType: ChartType = 'line';

  // Gráfico de Produtos Mais Vendidos (Barra)
  public productsChartData: ChartData<'bar'> = {
    labels: ['Notebook', 'Mouse', 'Teclado', 'Monitor', 'Webcam'],
    datasets: [
      {
        data: [45, 89, 67, 34, 52],
        label: 'Unidades Vendidas',
        backgroundColor: '#000',
        borderColor: '#000',
        borderWidth: 1
      }
    ]
  };

  public productsChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: false }
    },
    scales: {
      y: { beginAtZero: true }
    }
  };

  public productsChartType: ChartType = 'bar';

  // Gráfico de Formas de Pagamento (Pizza)
  public paymentChartData: ChartData<'pie'> = {
    labels: ['Dinheiro', 'Débito', 'Crédito', 'PIX'],
    datasets: [
      {
        data: [25, 20, 35, 20],
        backgroundColor: ['#000', '#333', '#666', '#999'],
        borderWidth: 2,
        borderColor: '#fff'
      }
    ]
  };

  public paymentChartOptions: ChartConfiguration['options'] = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: {
      legend: { display: true, position: 'right' }
    }
  };

  public paymentChartType: ChartType = 'pie';


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

  // Aplicar filtro de período
  applyPeriodFilter(period: PeriodFilter): void {
    this.selectedPeriod = period;
    this.loadDashboard();
    
    if (this.showComparison) {
      this.loadPreviousPeriodData();
    }
  }

  // Carregar dados do período anterior para comparação
  loadPreviousPeriodData(): void {
    // Simulação de dados do período anterior
    this.previousMetrics = {
      totalSales: 142,
      totalRevenue: 14200.30,
      totalExpenses: 3100.00,
      totalCredit: 480.50,
      lowStockProducts: 3,
      monthlySales: []
    };
  }

  // Toggle comparação
  toggleComparison(): void {
    this.showComparison = !this.showComparison;
    if (this.showComparison) {
      this.loadPreviousPeriodData();
    } else {
      this.previousMetrics = null;
    }
  }

  // Calcular variação percentual
  getPercentageChange(current: number, previous: number): number {
    if (previous === 0) return 0;
    return ((current - previous) / previous) * 100;
  }

  // Exportar gráfico como PNG
  exportChartAsPNG(chartId: string): void {
    const canvas = document.querySelector(`#${chartId} canvas`) as HTMLCanvasElement;
    if (canvas) {
      const link = document.createElement('a');
      link.download = `${chartId}-${Date.now()}.png`;
      link.href = canvas.toDataURL('image/png');
      link.click();
    }
  }

  // Exportar dashboard como PDF
  exportDashboardAsPDF(): void {
    const pdf = new jsPDF('p', 'mm', 'a4');
    const pageWidth = pdf.internal.pageSize.getWidth();
    
    // Título
    pdf.setFontSize(20);
    pdf.setFont('helvetica', 'bold');
    pdf.text('Dashboard - VendaMax', pageWidth / 2, 20, { align: 'center' });
    
    // Data
    pdf.setFontSize(10);
    pdf.setFont('helvetica', 'normal');
    pdf.text(`Gerado em: ${new Date().toLocaleString('pt-BR')}`, pageWidth / 2, 28, { align: 'center' });
    
    let yPos = 40;
    
    // Métricas
    if (this.metrics) {
      pdf.setFontSize(14);
      pdf.setFont('helvetica', 'bold');
      pdf.text('Métricas Principais', 14, yPos);
      yPos += 10;
      
      pdf.setFontSize(11);
      pdf.setFont('helvetica', 'normal');
      pdf.text(`Vendas Totais: ${this.metrics.totalSales}`, 14, yPos);
      yPos += 7;
      pdf.text(`Faturamento: ${this.formatCurrency(this.metrics.totalRevenue)}`, 14, yPos);
      yPos += 7;
      pdf.text(`Despesas: ${this.formatCurrency(this.metrics.totalExpenses)}`, 14, yPos);
      yPos += 7;
      pdf.text(`Créditos a Receber: ${this.formatCurrency(this.metrics.totalCredit)}`, 14, yPos);
      yPos += 7;
      pdf.text(`Produtos com Estoque Baixo: ${this.metrics.lowStockProducts}`, 14, yPos);
      yPos += 15;
    }
    
    // Adicionar gráficos (captura de canvas)
    const salesCanvas = document.querySelector('#salesChart canvas') as HTMLCanvasElement;
    if (salesCanvas) {
      const imgData = salesCanvas.toDataURL('image/png');
      pdf.text('Vendas por Período', 14, yPos);
      yPos += 5;
      pdf.addImage(imgData, 'PNG', 14, yPos, 180, 80);
      yPos += 90;
    }
    
    // Salvar PDF
    pdf.save(`dashboard-${Date.now()}.pdf`);
  }

  // Atualizar dados em tempo real (simulação)
  startRealTimeUpdates(): void {
    setInterval(() => {
      if (this.metrics) {
        // Simular pequenas mudanças nos dados
        this.metrics.totalSales += Math.floor(Math.random() * 3);
        this.metrics.totalRevenue += Math.random() * 100;
      }
    }, 30000); // Atualizar a cada 30 segundos
  }

  // Obter label do período
  getPeriodLabel(): string {
    const labels: Record<PeriodFilter, string> = {
      today: 'Hoje',
      week: 'Esta Semana',
      month: 'Este Mês',
      quarter: 'Este Trimestre',
      year: 'Este Ano',
      custom: 'Período Personalizado'
    };
    return labels[this.selectedPeriod];
  }

  // Calcular margem de lucro
  getProfitMargin(): number {
    if (!this.metrics) return 0;
    const profit = this.metrics.totalRevenue - this.metrics.totalExpenses;
    return (profit / this.metrics.totalRevenue) * 100;
  }

  // Calcular ROI
  getROI(): number {
    if (!this.metrics || this.metrics.totalExpenses === 0) return 0;
    const profit = this.metrics.totalRevenue - this.metrics.totalExpenses;
    return (profit / this.metrics.totalExpenses) * 100;
  }
}
