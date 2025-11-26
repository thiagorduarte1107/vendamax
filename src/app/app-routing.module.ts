import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LoginComponent } from './components/login/login.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { LayoutComponent } from './components/layout/layout.component';
import { ProductsComponent } from './components/products/products.component';
import { ClientsComponent } from './components/clients/clients.component';
import { SalesComponent } from './components/sales/sales.component';
import { CategoriesComponent } from './components/categories/categories.component';
import { AccountsReceivableComponent } from './components/accounts-receivable/accounts-receivable.component';
import { AccountsPayableComponent } from './components/accounts-payable/accounts-payable.component';
import { PdvComponent } from './components/pdv/pdv.component';
import { SalesReportComponent } from './components/sales-report/sales-report.component';
import { StockControlComponent } from './components/stock-control/stock-control.component';
import { UserManagementComponent } from './components/user-management/user-management.component';
import { AuthGuard } from './guards/auth.guard';

const routes: Routes = [
  { path: 'login', component: LoginComponent },
  {
    path: '',
    component: LayoutComponent,
    canActivate: [AuthGuard],
    children: [
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      { path: 'dashboard', component: DashboardComponent },
      { path: 'pdv', component: PdvComponent },
      { path: 'products', component: ProductsComponent },
      { path: 'stock-control', component: StockControlComponent },
      { path: 'clients', component: ClientsComponent },
      { path: 'sales', component: SalesComponent },
      { path: 'sales-report', component: SalesReportComponent },
      { path: 'categories', component: CategoriesComponent },
      { path: 'accounts-receivable', component: AccountsReceivableComponent },
      { path: 'accounts-payable', component: AccountsPayableComponent },
      { path: 'user-management', component: UserManagementComponent }
    ]
  },
  { path: '**', redirectTo: '' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
