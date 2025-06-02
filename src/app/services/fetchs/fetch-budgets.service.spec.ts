import { TestBed } from '@angular/core/testing';

import { FetchBudgetsService } from './fetch-budgets.service';

describe('FetchBudgetsService', () => {
  let service: FetchBudgetsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchBudgetsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
