import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

import { LucideAngularModule } from 'lucide-angular';
import { CylindricalSiloCalculatorComponent } from '../cylindrical-silo-calculator/cylindrical-silo-calculator.component';
import { RectangularSiloCalculatorComponent } from '../rectangular-silo-calculator/rectangular-silo-calculator.component';
import { BasculaCalculatorComponent } from '../bascula-calculator/bascula-calculator.component';

type CalculatorType = 'cylindrical' | 'rectangular' | 'bascula';

@Component({
  selector: 'app-shape-calculator',
  standalone: true,
  
  imports: [
    CommonModule,     
    RouterModule,     
    LucideAngularModule
  ],
  templateUrl: './shape-calculator.component.html',
  styleUrls: ['./shape-calculator.component.css']
})
export class ShapeCalculatorComponent {

  navigationItems = [
    { path: 'silo-cilindrico', label: 'Silo Cilíndrico', icon: 'cylinder' },
    { path: 'silo-retangular', label: 'Silo Retangular', icon: 'box' },
    { path: 'bascula', label: 'Báscula', icon: 'truck' }
  ];

  constructor() {}
}