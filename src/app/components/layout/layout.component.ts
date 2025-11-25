import { Component, OnInit, HostListener, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  currentUser: User | null = null;
  sidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  isMobile = false;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'inventory_2', label: 'Produtos', route: '/products' },
    { icon: 'people', label: 'Clientes', route: '/clients' },
    { icon: 'shopping_cart', label: 'Vendas', route: '/sales' },
    { icon: 'category', label: 'Categorias', route: '/categories' },
    { icon: 'account_balance_wallet', label: 'Contas a Receber', route: '/accounts-receivable' },
    { icon: 'receipt', label: 'Contas a Pagar', route: '/accounts-payable' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    this.checkScreenSize();
  }

  @HostListener('window:resize', ['$event'])
  onResize() {
    this.checkScreenSize();
  }

  checkScreenSize(): void {
    this.isMobile = window.innerWidth < 768;
    this.sidenavMode = 'over'; // Sempre modo over (aparece ao clicar)
    this.sidenavOpened = false; // Sempre inicia fechado
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }

  toggleSidenav(): void {
    if (this.sidenav) {
      this.sidenav.toggle();
    }
  }

  closeSidenavOnMobile(): void {
    // Sempre fecha ao clicar em item (desktop e mobile)
    if (this.sidenav) {
      this.sidenav.close();
    }
  }

  getInitials(name: string): string {
    if (!name) return 'U';
    
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    
    return (names[0].charAt(0) + names[names.length - 1].charAt(0)).toUpperCase();
  }

  getPageTitle(): string {
    const currentRoute = this.router.url;
    const menuItem = this.menuItems.find(item => item.route === currentRoute);
    return menuItem ? menuItem.label : 'VendaMax';
  }
}
