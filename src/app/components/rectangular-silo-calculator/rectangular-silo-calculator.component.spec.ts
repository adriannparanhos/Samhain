import { ComponentFixture, TestBed } from '@angular/core/testing';

import { RectangularSiloCalculatorComponent } from './rectangular-silo-calculator.component';

describe('RectangularSiloCalculatorComponent', () => {
  let component: RectangularSiloCalculatorComponent;
  let fixture: ComponentFixture<RectangularSiloCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [RectangularSiloCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(RectangularSiloCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
