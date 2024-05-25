/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { UsuarioAdmService } from './usuario-adm.service';

describe('Service: UsuarioAdm', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [UsuarioAdmService]
    });
  });

  it('should ...', inject([UsuarioAdmService], (service: UsuarioAdmService) => {
    expect(service).toBeTruthy();
  }));
});
