/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RecuperaCadastroService } from './recupera-cadastro.service';

describe('Service: RecuperaCadastro', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RecuperaCadastroService]
    });
  });

  it('should ...', inject([RecuperaCadastroService], (service: RecuperaCadastroService) => {
    expect(service).toBeTruthy();
  }));
});
