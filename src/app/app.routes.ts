import { Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ProductsComponent } from './components/products/products.component';
import { EnterprisesComponent } from './components/enterprises/enterprises.component';
import { BudgetsComponent } from './components/budgets/budgets.component';
import { AddNewEnterpriseComponent } from './components/add-new-enterprise/add-new-enterprise.component';
import { AddNewProductComponent } from './components/add-new-product/add-new-product.component';
import { AddNewBudgetComponent } from './components/add-new-budget/add-new-budget.component';
import { OrcamentoPdfComponent } from './components/orcamento-pdf/orcamento-pdf.component';
import { PedidosComponent } from './components/pedidos/pedidos.component';

export const routes: Routes = [
    {path: 'dashboard', component: DashboardComponent},
    {path: 'products', component: ProductsComponent},
    {path: 'enterprises', component: EnterprisesComponent},
    {path: 'budgets', component: BudgetsComponent},
    {path: 'enterprises/add', component: AddNewEnterpriseComponent},
    {path: 'products/add', component: AddNewProductComponent},
    {path: 'budgets/add', component: AddNewBudgetComponent},
    {path: 'budgets/edit/:proposta', component: AddNewBudgetComponent},
    {path: 'budget/pdf', component: OrcamentoPdfComponent},
    {path: 'orders', component: PedidosComponent}
];

