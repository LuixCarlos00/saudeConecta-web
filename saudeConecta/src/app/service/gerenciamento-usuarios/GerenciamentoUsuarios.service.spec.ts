/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { GerenciamentoUsuariosService } from './GerenciamentoUsuarios.service';

describe('Service: GerenciamentoUsuarios', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [GerenciamentoUsuariosService]
    });
  });

  it('should ...', inject([GerenciamentoUsuariosService], (service: GerenciamentoUsuariosService) => {
    expect(service).toBeTruthy();
  }));
});
