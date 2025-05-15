import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewBudgetComponent } from './add-new-budget.component';

describe('AddNewBudgetComponent', () => {
  let component: AddNewBudgetComponent;
  let fixture: ComponentFixture<AddNewBudgetComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewBudgetComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewBudgetComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
