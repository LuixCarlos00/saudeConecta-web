/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ServiceConsultaMedicosService } from './service-consultaMedicos.service';

describe('Service: ServiceConsultaMedicos', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ServiceConsultaMedicosService]
    });
  });

  it('should ...', inject([ServiceConsultaMedicosService], (service: ServiceConsultaMedicosService) => {
    expect(service).toBeTruthy();
  }));
});
