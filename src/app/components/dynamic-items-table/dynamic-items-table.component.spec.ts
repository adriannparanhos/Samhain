import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DynamicItemsTableComponent } from './dynamic-items-table.component';

describe('DynamicItemsTableComponent', () => {
  let component: DynamicItemsTableComponent;
  let fixture: ComponentFixture<DynamicItemsTableComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DynamicItemsTableComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DynamicItemsTableComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
