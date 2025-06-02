import { TestBed } from '@angular/core/testing';

import { NumericToStringInterceptorService } from './numeric-to-string-interceptor.service';

describe('NumericToStringInterceptorService', () => {
  let service: NumericToStringInterceptorService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(NumericToStringInterceptorService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
