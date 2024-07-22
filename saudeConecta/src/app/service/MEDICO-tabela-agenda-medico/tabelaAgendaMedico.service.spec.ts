/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { TabelaAgendaMedicoService } from './tabelaAgendaMedico.service';

describe('Service: TabelaAgendaMedico', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [TabelaAgendaMedicoService]
    });
  });

  it('should ...', inject([TabelaAgendaMedicoService], (service: TabelaAgendaMedicoService) => {
    expect(service).toBeTruthy();
  }));
});
