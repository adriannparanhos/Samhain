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
import { LoginComponent } from './pages/login/login.component';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';
import { authGuard } from './guards/auth.guard'; // Importe o guardião


export const routes: Routes = [
    // Rotas de "Tela Cheia" (sem layout principal)
    { path: 'login', component: LoginComponent },    
    // Rota padrão redireciona para o login
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Rota "Pai" que carrega o AppLayoutComponent
    // Todas as rotas que precisam do header/sidebar serão filhas (children) desta rota
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        // canActivate: [AuthGuard], // No futuro, adicione um guardião de rota aqui
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, // Redireciona para o dashboard se estiver logado
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'products/add', component: AddNewProductComponent },
            { path: 'products/edit/:id', component: AddNewProductComponent },
            { path: 'enterprises', component: EnterprisesComponent },
            { path: 'enterprises/add', component: AddNewEnterpriseComponent },
            { path: 'budgets', component: BudgetsComponent },
            { path: 'budgets/add', component: AddNewBudgetComponent },
            { path: 'budgets/edit/:proposta', component: AddNewBudgetComponent },
            { path: 'budget/pdf', component: OrcamentoPdfComponent }, // PDF também é tela cheia
            { path: 'orders', component: PedidosComponent },
        ]
    },

    // Rota "catch-all" para redirecionar rotas inválidas (opcional, mas recomendado)
    { path: '**', redirectTo: '/login' }
];

