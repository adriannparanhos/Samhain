import { ApplicationConfig, importProvidersFrom, LOCALE_ID } from '@angular/core';
import { provideRouter } from '@angular/router';
import { provideHttpClient, withInterceptorsFromDi, HTTP_INTERCEPTORS, withInterceptors  } from '@angular/common/http';
import { routes } from './app.routes';
import { NumericToStringInterceptor } from './services/httpInterceptors/numeric-to-string-interceptor.service';
import { authInterceptor } from './interceptors/auth.interceptor';
import { LucideAngularModule, LUCIDE_ICONS, LucideIconProvider, FileBox, Home, Building2, Package, FileText, LogOut, Menu, X, User, Search, Check, Clock, HelpCircle, ArrowLeft, Save, Building2Icon, Eye, Pencil, Trash2, Info, ShoppingCart, FileCheck, UserCircle, Users, FilePenIcon, FilePenLine, KeyRound, SlidersHorizontal, Hammer, UploadCloud, Paperclip, Cone, SquareFunction, Cylinder, Box, Truck, ListCheck, FileSpreadsheet, Wrench, UserRound, Printer, DollarSign, CalendarDays } from 'lucide-angular';
import { CalendarModule, DateAdapter, CalendarCommonModule } from 'angular-calendar';
import { adapterFactory } from 'angular-calendar/date-adapters/date-fns';
import { provideAnimations } from '@angular/platform-browser/animations';
import { EventClickArg } from '@fullcalendar/core/index.js';


export const appConfig: ApplicationConfig = {
  providers: [
    provideRouter(routes),
    provideHttpClient(withInterceptors([authInterceptor])),
    importProvidersFrom(LucideAngularModule),
    { provide: LUCIDE_ICONS, multi: true, useValue: new LucideIconProvider({ FileBox, Home, Building2, Package, FileText, LogOut, Menu, X, User, Search, Check, Clock, HelpCircle, ArrowLeft, Save, Building2Icon, Eye, Pencil, Trash2, Info, ShoppingCart, FileCheck, UserCircle, Users, FilePenIcon, FilePenLine, KeyRound, SlidersHorizontal, Hammer, UploadCloud, Paperclip, Cone, SquareFunction, Cylinder, Box, Truck, ListCheck, FileSpreadsheet, Wrench, UserRound, Printer, DollarSign, CalendarDays }) },
    { provide: LOCALE_ID, useValue: 'pt-BR' },
    { provide: HTTP_INTERCEPTORS, useClass: NumericToStringInterceptor, multi: true }, 
    provideAnimations(), 
    importProvidersFrom(
      CalendarModule.forRoot({
        provide: DateAdapter,
        useFactory: adapterFactory,
      })
    ),
    
  ]
};