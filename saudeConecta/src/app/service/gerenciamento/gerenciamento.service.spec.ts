/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GerenciamentoService } from './gerenciamento.service';

describe('Service: Gerenciamento', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GerenciamentoService]
    });
  });

  it('should ...', inject([GerenciamentoService], (service: GerenciamentoService) => {
    expect(service).toBeTruthy();
  }));
});
