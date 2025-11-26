import { Component, OnInit, HostListener, ViewChild, ElementRef } from '@angular/core';
import { Router } from '@angular/router';
import { MatSidenav } from '@angular/material/sidenav';
import { AuthService } from '../../services/auth.service';
import { User } from '../../models';
import { NotificationService, Notification } from '../../services/notification.service';
import { BackupService } from '../../services/backup.service';
import { MatBadgeModule } from '@angular/material/badge';

@Component({
  selector: 'app-layout',
  templateUrl: './layout.component.html',
  styleUrls: ['./layout.component.scss']
})
export class LayoutComponent implements OnInit {
  @ViewChild('sidenav') sidenav!: MatSidenav;
  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;
  
  currentUser: User | null = null;
  sidenavOpened = true;
  sidenavMode: 'side' | 'over' = 'side';
  isMobile = false;

  notifications: Notification[] = [];
  unreadCount = 0;

  menuItems = [
    { icon: 'dashboard', label: 'Dashboard', route: '/dashboard' },
    { icon: 'point_of_sale', label: 'PDV', route: '/pdv' },
    { icon: 'inventory_2', label: 'Produtos', route: '/products' },
    { icon: 'warehouse', label: 'Controle de Estoque', route: '/stock-control' },
    { icon: 'people', label: 'Clientes', route: '/clients' },
    { icon: 'shopping_cart', label: 'Vendas', route: '/sales' },
    { icon: 'assessment', label: 'Relatório de Vendas', route: '/sales-report' },
    { icon: 'category', label: 'Categorias', route: '/categories' },
    { icon: 'account_balance_wallet', label: 'Contas a Receber', route: '/accounts-receivable' },
    { icon: 'receipt', label: 'Contas a Pagar', route: '/accounts-payable' },
    { icon: 'manage_accounts', label: 'Usuários', route: '/user-management' }
  ];

  constructor(
    private authService: AuthService,
    private router: Router,
    private notificationService: NotificationService,
    private backupService: BackupService
  ) {}

  ngOnInit(): void {
    this.authService.currentUser$.subscribe(user => {
      this.currentUser = user;
    });
    
    this.notificationService.notifications$.subscribe(notifications => {
      this.notifications = notifications;
      this.unreadCount = notifications.filter(n => !n.read).length;
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

  markAsRead(id: string): void {
    this.notificationService.markAsRead(id);
  }

  markAllAsRead(): void {
    this.notificationService.markAllAsRead();
  }

  getNotificationIcon(type: string): string {
    const icons: { [key: string]: string } = {
      'low-stock': 'warning',
      'out-of-stock': 'error',
      'expiring': 'schedule',
      'info': 'info'
    };
    return icons[type] || 'notifications';
  }

  exportBackup(): void {
    this.backupService.exportAllData();
  }

  importBackup(): void {
    this.fileInput.nativeElement.click();
  }

  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.backupService.importFromJSON(file).then(data => {
        if (confirm('Deseja restaurar todos os dados do backup? Os dados atuais serão substituídos!')) {
          this.backupService.restoreAllData(data);
          alert('Backup restaurado com sucesso! A página será recarregada.');
          window.location.reload();
        }
      }).catch(error => {
        alert('Erro ao importar backup: ' + error);
      });
    }
  }
}
