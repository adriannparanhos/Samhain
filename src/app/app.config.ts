import { ApplicationConfig, importProvidersFrom } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient } from '@angular/common/http';
import { routes } from './app.routes';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, FileBox, Home, Building2, Package, FileText, LogOut, Menu, X, User, Search } from 'lucide-angular';

export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(),
    importProvidersFrom(LucideAngularModule),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ FileBox, Home, Building2, Package, FileText, LogOut, Menu, X, User, Search })}
  ]
};