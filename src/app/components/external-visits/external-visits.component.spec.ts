import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ExternalVisitsComponent } from './external-visits.component';

describe('ExternalVisitsComponent', () => {
  let component: ExternalVisitsComponent;
  let fixture: ComponentFixture<ExternalVisitsComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ExternalVisitsComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ExternalVisitsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
