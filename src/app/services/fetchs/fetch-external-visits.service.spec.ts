import { TestBed } from '@angular/core/testing';

import { FetchExternalVisitsService } from './fetch-external-visits.service';

describe('FetchExternalVisitsService', () => {
  let service: FetchExternalVisitsService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchExternalVisitsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
