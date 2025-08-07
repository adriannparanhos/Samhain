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
import { authGuard } from './guards/auth.guard'; 
import { SettingsComponent } from './pages/settings/settings.component';
import { loginGuard } from './guards/login.guard'; 
import { ServicesFormComponent } from './components/services-form/services-form.component';
import { ServiceBudgetComponent } from './components/service-budget-data/service-budget-data.component';
import { ShapeCalculatorComponent } from './components/shape-calculator/shape-calculator.component';
import { CylindricalSiloCalculatorComponent } from './components/cylindrical-silo-calculator/cylindrical-silo-calculator.component';
import { RectangularSiloCalculatorComponent } from './components/rectangular-silo-calculator/rectangular-silo-calculator.component';
import { BasculaCalculatorComponent } from './components/bascula-calculator/bascula-calculator.component';
import { ChecklistComponent } from './components/checklist/checklist.component';
import { ExternalVisitsComponent } from './components/external-visits/external-visits.component';

export const routes: Routes = [
    { path: 'login', component: LoginComponent, canActivate: [loginGuard] },    
    { path: '', redirectTo: '/login', pathMatch: 'full' },

    // Rota "Pai" que carrega o AppLayoutComponent
    // Todas as rotas que precisam do header/sidebar serão filhas (children) desta rota
    {
        path: '',
        component: AppLayoutComponent,
        canActivate: [authGuard],
        children: [
            { path: '', redirectTo: 'dashboard', pathMatch: 'full' }, 
            { path: 'dashboard', component: DashboardComponent },
            { path: 'products', component: ProductsComponent },
            { path: 'products/add', component: AddNewProductComponent },
            { path: 'products/edit/:id', component: AddNewProductComponent },
            { path: 'enterprises', component: EnterprisesComponent },
            { path: 'enterprises/add', component: AddNewEnterpriseComponent },
            { path: 'budgets', component: BudgetsComponent },
            { path: 'budgets/add', component: AddNewBudgetComponent },
            { path: 'budgets/edit/:proposta', component: AddNewBudgetComponent },
            { path: 'budget/pdf', component: OrcamentoPdfComponent }, 
            { path: 'orders', component: PedidosComponent },
            { path: 'settings', component: SettingsComponent },
            { path: 'services', component: ServicesFormComponent },
            { path: 'service-budget-data', component: ServiceBudgetComponent},
            {
                path: 'advanced-geometry',
                component: ShapeCalculatorComponent,
                children: [
                { path: 'silo-cilindrico', component: CylindricalSiloCalculatorComponent },
                { path: 'silo-retangular', component: RectangularSiloCalculatorComponent },
                { path: 'bascula', component: BasculaCalculatorComponent },
                { path: '', redirectTo: 'silo-cilindrico', pathMatch: 'full' } 
                ]
            },
            { path: 'checklist/:proposta', component: ChecklistComponent},
            { path: 'visits', component: ExternalVisitsComponent}
        ]
    },

    { path: '**', redirectTo: '/login' }
];

