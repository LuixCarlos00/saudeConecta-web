/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HistoricoService } from './historico.service';

describe('Service: Historico', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HistoricoService]
    });
  });

  it('should ...', inject([HistoricoService], (service: HistoricoService) => {
    expect(service).toBeTruthy();
  }));
});
