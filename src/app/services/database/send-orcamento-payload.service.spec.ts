import { TestBed } from '@angular/core/testing';

import { SendOrcamentoPayloadService } from './send-orcamento-payload.service';

describe('SendOrcamentoPayloadService', () => {
  let service: SendOrcamentoPayloadService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SendOrcamentoPayloadService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
