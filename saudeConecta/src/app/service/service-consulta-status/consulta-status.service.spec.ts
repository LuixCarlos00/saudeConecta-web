/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ConsultaStatusService } from './consulta-status.service';

describe('Service: ConsultaStatus', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ConsultaStatusService]
    });
  });

  it('should ...', inject([ConsultaStatusService], (service: ConsultaStatusService) => {
    expect(service).toBeTruthy();
  }));
});
