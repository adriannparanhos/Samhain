import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ServiceBudgetDataComponent } from './service-budget-data.component';

describe('ServiceBudgetDataComponent', () => {
  let component: ServiceBudgetDataComponent;
  let fixture: ComponentFixture<ServiceBudgetDataComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ServiceBudgetDataComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ServiceBudgetDataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
