/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { NgGrokService } from './ngGrok.service';

describe('Service: NgGrok', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NgGrokService]
    });
  });

  it('should ...', inject([NgGrokService], (service: NgGrokService) => {
    expect(service).toBeTruthy();
  }));
});
