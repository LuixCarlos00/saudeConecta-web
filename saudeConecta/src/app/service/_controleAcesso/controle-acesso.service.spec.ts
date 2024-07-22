/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ControleAcessoService } from './controle-acesso.service';

describe('Service: ControleAcesso', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ControleAcessoService]
    });
  });

  it('should ...', inject([ControleAcessoService], (service: ControleAcessoService) => {
    expect(service).toBeTruthy();
  }));
});
