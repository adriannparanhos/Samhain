import { TestBed } from '@angular/core/testing';

import { FetchEnterpriseService } from './fetch-enterprise.service';

describe('FetchEnterpriseService', () => {
  let service: FetchEnterpriseService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(FetchEnterpriseService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
