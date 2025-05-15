import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { EnterprisesComponent } from './components/enterprises/enterprises.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'enterprises', component: EnterprisesComponent},
];
