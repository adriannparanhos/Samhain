import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule, Router } from '@angular/router';
import { LucideAngularModule } from 'lucide-angular';
import { AuthService } from '../../services/auth.service';
import { DataService } from '../../services/data.service';

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
    DataService
  ],
  templateUrl: './app-layout.component.html',
  styleUrls: ['./app-layout.component.css']
})
export class AppLayoutComponent {
  isSidebarOpen = true;
  user: any;

  navigationItems: NavItem[] = [
    { name: 'Dashboard', path: '/dashboard', icon: 'home'      },
    { name: 'Empresas',  path: '/companies', icon: 'building-2'},
    { name: 'Produtos',  path: '/products',  icon: 'package'   },
    { name: 'Orçamentos',path: '/budgets',   icon: 'file-text' }
  ];

  constructor(
    private auth: AuthService,
    private router: Router,
    public data: DataService
  ) {
    this.user = this.auth.currentUser;
  }

  toggleSidebar() {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  logout() {
    this.auth.logout();
    this.router.navigate(['/login']);
  }
}