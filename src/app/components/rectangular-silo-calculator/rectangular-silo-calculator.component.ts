import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { debounceTime } from 'rxjs/operators';

@Component({
  selector: 'app-rectangular-silo-calculator',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './rectangular-silo-calculator.component.html',
})
export class RectangularSiloCalculatorComponent implements OnInit {

  calcForm: FormGroup;
  areaTotal: number = 0;

  constructor(private fb: FormBuilder) {
    this.calcForm = this.fb.group({
      comprimentoC: [null, [Validators.required, Validators.min(1)]],
      larguraA: [null, [Validators.required, Validators.min(1)]],
      alturaRetaH1: [null, [Validators.required, Validators.min(1)]],
      alturaFunilH2: [null, [Validators.required, Validators.min(1)]],
      alturaFunilH3: [null, [Validators.required, Validators.min(1)]],
      baseMenorB1: [null, [Validators.required, Validators.min(1)]],
      baseMenorB2: [null, [Validators.required, Validators.min(1)]]
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
    const C = values.comprimentoC;
    const A = values.larguraA;
    const h1 = values.alturaRetaH1;
    const h2 = values.alturaFunilH2;
    const h3 = values.alturaFunilH3;
    const B1 = values.baseMenorB1;
    const B2 = values.baseMenorB2;

    const Cm = C / 1000;
    const Am = A / 1000;
    const h1m = h1 / 1000;
    const h2m = h2 / 1000;
    const h3m = h3 / 1000;
    const B1m = B1 / 1000;
    const B2m = B2 / 1000;

    const areaParteReta = (2 * Am * h1m) + (2 * Cm * h1m);

    const areaFunilLadoLargo = 2 * ( (Cm + B1m) / 2 * h2m );
    const areaFunilLadoEstreito = 2 * ( (Am + B2m) / 2 * h3m );
    const areaFunil = areaFunilLadoLargo + areaFunilLadoEstreito;

    this.areaTotal = areaParteReta + areaFunil;
  }
}