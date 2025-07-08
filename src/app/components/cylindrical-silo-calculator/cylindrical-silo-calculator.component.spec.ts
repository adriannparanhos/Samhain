import { ComponentFixture, TestBed } from '@angular/core/testing';

import { CylindricalSiloCalculatorComponent } from './cylindrical-silo-calculator.component';

describe('CylindricalSiloCalculatorComponent', () => {
  let component: CylindricalSiloCalculatorComponent;
  let fixture: ComponentFixture<CylindricalSiloCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CylindricalSiloCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(CylindricalSiloCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
