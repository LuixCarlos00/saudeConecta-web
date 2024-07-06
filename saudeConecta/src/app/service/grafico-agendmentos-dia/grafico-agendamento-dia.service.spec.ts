/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GraficoAgendamentoDiaService } from './grafico-agendamento-dia.service';

describe('Service: GraficoAgendamentoDia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraficoAgendamentoDiaService]
    });
  });

  it('should ...', inject([GraficoAgendamentoDiaService], (service: GraficoAgendamentoDiaService) => {
    expect(service).toBeTruthy();
  }));
});
