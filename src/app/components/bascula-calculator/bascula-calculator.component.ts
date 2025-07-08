import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-bascula-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './bascula-calculator.component.html',
})
export class BasculaCalculatorComponent implements OnInit {

  calcForm: FormGroup;
  areaTotal: number = 0;

  constructor(private fb: FormBuilder) {
    this.calcForm = this.fb.group({
      alturaRetaC: [null, [Validators.required, Validators.min(1)]],
      baseRetaB: [null, [Validators.required, Validators.min(1)]],
      comprimentoE: [null, [Validators.required, Validators.min(1)]]
    });
  }

  ngOnInit(): void {
    this.calcForm.valueChanges.pipe(debounceTime(300)).subscribe(() => {
      if (this.calcForm.valid) {
        this.calcularArea();
      } else {
        this.areaTotal = 0;
      }
    });
  }

  calcularArea(): void {
    const values = this.calcForm.value;
    const C = values.alturaRetaC;
    const B = values.baseRetaB;
    const E = values.comprimentoE;

    const Cm = C / 1000;
    const Bm = B / 1000;
    const Em = E / 1000;

    const perimetroSecaoU = (2 * Cm) + (Math.PI * Bm / 2);

    this.areaTotal = perimetroSecaoU * Em;
  }
}