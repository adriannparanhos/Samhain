import { TestBed } from '@angular/core/testing';

import { DadosNovoOrcamentoService } from './dados-novo-orcamento.service';

describe('DadosNovoOrcamentoService', () => {
  let service: DadosNovoOrcamentoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosNovoOrcamentoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
