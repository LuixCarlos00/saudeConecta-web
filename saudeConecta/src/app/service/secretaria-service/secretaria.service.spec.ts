/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { SecretariaService } from './secretaria.service';

describe('Service: Secretaria', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [SecretariaService]
    });
  });

  it('should ...', inject([SecretariaService], (service: SecretariaService) => {
    expect(service).toBeTruthy();
  }));
});
