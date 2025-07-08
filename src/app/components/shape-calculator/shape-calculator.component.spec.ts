import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ShapeCalculatorComponent } from './shape-calculator.component';

describe('ShapeCalculatorComponent', () => {
  let component: ShapeCalculatorComponent;
  let fixture: ComponentFixture<ShapeCalculatorComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ShapeCalculatorComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ShapeCalculatorComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
