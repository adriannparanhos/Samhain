import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChartVisitsGraphComponent } from './chart-visits-graph.component';

describe('ChartVisitsGraphComponent', () => {
  let component: ChartVisitsGraphComponent;
  let fixture: ComponentFixture<ChartVisitsGraphComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ChartVisitsGraphComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChartVisitsGraphComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
