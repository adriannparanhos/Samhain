import { TestBed } from '@angular/core/testing';

import { CalculateValueStandartService } from './calculate-value-standart.service';

describe('CalculateValueStandartService', () => {
  let service: CalculateValueStandartService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(CalculateValueStandartService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
