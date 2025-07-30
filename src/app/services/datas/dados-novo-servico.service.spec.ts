import { TestBed } from '@angular/core/testing';

import { DadosNovoServicoService } from './dados-novo-servico.service';

describe('DadosNovoServicoService', () => {
  let service: DadosNovoServicoService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(DadosNovoServicoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
