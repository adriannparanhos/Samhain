import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewEnterpriseComponent } from './add-new-enterprise.component';

describe('AddNewEnterpriseComponent', () => {
  let component: AddNewEnterpriseComponent;
  let fixture: ComponentFixture<AddNewEnterpriseComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewEnterpriseComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewEnterpriseComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
