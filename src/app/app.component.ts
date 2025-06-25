import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { AppLayoutComponent } from './components/app-layout/app-layout.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterOutlet,      
    AppLayoutComponent  
  ],
  template: `
    <!-- <app-layout></app-layout> -->
    <router-outlet></router-outlet>
  `
})
export class AppComponent { }
