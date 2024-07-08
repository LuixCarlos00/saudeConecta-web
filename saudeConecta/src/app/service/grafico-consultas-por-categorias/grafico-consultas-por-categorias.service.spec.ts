/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GraficoConsultasPorCategoriasService } from './grafico-consultas-por-categorias.service';

describe('Service: GraficoConsultasPorCategorias', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GraficoConsultasPorCategoriasService]
    });
  });

  it('should ...', inject([GraficoConsultasPorCategoriasService], (service: GraficoConsultasPorCategoriasService) => {
    expect(service).toBeTruthy();
  }));
});
