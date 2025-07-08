import { Component, AfterViewInit, ChangeDetectorRef } from '@angular/core';
import { CommonModule } from '@angular/common'; 
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
    LucideAngularModule,
    CylindricalSiloCalculatorComponent,
    RectangularSiloCalculatorComponent,
    BasculaCalculatorComponent
  ],
  templateUrl: './shape-calculator.component.html',
})
export class ShapeCalculatorComponent implements AfterViewInit{

  constructor(private cdr: ChangeDetectorRef) {}

  navigationItems = [
    { id: 'cylindrical', label: 'Silo Cilíndrico', icon: 'cylinder' },
    { id: 'rectangular', label: 'Silo Retangular', icon: 'box' },
    { id: 'bascula', label: 'Báscula', icon: 'truck' }
  ];

  activeCalculator: CalculatorType = 'cylindrical';

  ngAfterViewInit(): void {
    setTimeout(() => {
      this.cdr.detectChanges();
    }, 0);
  }

  selectCalculator(type: string): void {
    this.activeCalculator = type as CalculatorType;
  }
}