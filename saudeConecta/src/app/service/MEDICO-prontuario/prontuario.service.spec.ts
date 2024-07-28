/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ProntuarioService } from './prontuario.service';

describe('Service: Prontuario', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ProntuarioService]
    });
  });

  it('should ...', inject([ProntuarioService], (service: ProntuarioService) => {
    expect(service).toBeTruthy();
  }));
});
