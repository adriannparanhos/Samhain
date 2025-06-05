import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS } from '@angular/common/http';
import { routes } from './app.routes';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, FileBox, Home, Building2, Package, FileText, LogOut, Menu, X, User, Search, Check, Clock, HelpCircle, ArrowLeft, Save, Building2Icon, Eye, Pencil, Trash2, Info, ShoppingCart, FileCheck } from 'lucide-angular';
import { NumericToStringInterceptor } from './services/httpInterceptors/numeric-to-string-interceptor.service';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptorsFromDi()),
    importProvidersFrom(LucideAngularModule),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ FileBox, Home, Building2, Package, FileText, LogOut, Menu, X, User, Search, Check, Clock, HelpCircle, ArrowLeft, Save, Building2Icon, Eye, Pencil, Trash2, Info, ShoppingCart, FileCheck }) },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: NumericToStringInterceptor, multi: true }, 
  ]
};