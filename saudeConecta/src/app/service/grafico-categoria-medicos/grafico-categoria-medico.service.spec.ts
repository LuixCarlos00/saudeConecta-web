/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GraficoCategoriaMedicoService } from './grafico-categoria-medico.service';

describe('Service: GraficoCategoriaMedico', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraficoCategoriaMedicoService]
    });
  });

  it('should ...', inject([GraficoCategoriaMedicoService], (service: GraficoCategoriaMedicoService) => {
    expect(service).toBeTruthy();
  }));
});
