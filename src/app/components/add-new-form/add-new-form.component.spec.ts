import { ComponentFixture, TestBed } from '@angular/core/testing';

import { AddNewFormComponent } from './add-new-form.component';

describe('AddNewFormComponent', () => {
  let component: AddNewFormComponent;
  let fixture: ComponentFixture<AddNewFormComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AddNewFormComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(AddNewFormComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
