import { ComponentFixture, TestBed } from '@angular/core/testing';

import { BasculaCalculatorComponent } from './bascula-calculator.component';

describe('BasculaCalculatorComponent', () => {
  let component: BasculaCalculatorComponent;
  let fixture: ComponentFixture<BasculaCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [BasculaCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(BasculaCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
