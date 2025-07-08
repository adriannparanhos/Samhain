import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-cylindrical-silo-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cylindrical-silo-calculator.component.html',
})
export class CylindricalSiloCalculatorComponent implements OnInit {

  calcForm: FormGroup;
  areaTotal: number = 0;

  constructor(private fb: FormBuilder) {
    this.calcForm = this.fb.group({
      diametroMaiorD: [null, [Validators.required, Validators.min(1)]],
      diametroMenorD: [null, [Validators.required, Validators.min(1)]],
      alturaCilindroH: [null, [Validators.required, Validators.min(1)]],
      alturaConeH: [null, [Validators.required, Validators.min(1)]]
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
    const D = values.diametroMaiorD;
    const d = values.diametroMenorD;
    const H = values.alturaCilindroH;
    const h = values.alturaConeH;

    const Dm = D / 1000;
    const dm = d / 1000;
    const Hm = H / 1000;
    const hm = h / 1000;

    const areaCilindro = Math.PI * Dm * Hm;

    const R = Dm / 2; 
    const r = dm / 2; 
    const geratriz = Math.sqrt(Math.pow(hm, 2) + Math.pow(R - r, 2));
    const areaCone = Math.PI * (R + r) * geratriz;

    this.areaTotal = areaCilindro + areaCone;
  }
}