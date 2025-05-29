import { ComponentFixture, TestBed } from '@angular/core/testing';

import { OrcamentoPdfComponent } from './orcamento-pdf.component';

describe('OrcamentoPdfComponent', () => {
  let component: OrcamentoPdfComponent;
  let fixture: ComponentFixture<OrcamentoPdfComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [OrcamentoPdfComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(OrcamentoPdfComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
