import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { AuthLoginService } from '../../services/auth-login.service';

interface NavItem {
  name: string;
  path: string;
  icon: string;
}

@Component({
  selector: 'app-layout',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    LucideAngularModule
  ],
  providers: [
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  isSidebarOpen = true;
  user: any;

  navigationItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: 'home'      },
    { name: 'Empresas',  path: '/enterprises', icon: 'building-2'},
    { name: 'Produtos',  path: '/products',  icon: 'package'   },
    { name: 'Orçamentos',path: '/budgets',   icon: 'file-text' },
    { name: 'Pedidos', path: '/orders',    icon: 'file-check' },
    { name: 'Serviços', path: '/services', icon: 'Hammer'       },
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    private authService: AuthLoginService
  ) {
    this.user = this.authService.currentUserValue  
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout(): void {
    this.authService.logout();
    this.router.navigate(['/login']);
  }
}