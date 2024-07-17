/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CronologiaService } from './Cronologia.service';

describe('Service: Cronologia', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CronologiaService]
    });
  });

  it('should ...', inject([CronologiaService], (service: CronologiaService) => {
    expect(service).toBeTruthy();
  }));
});
