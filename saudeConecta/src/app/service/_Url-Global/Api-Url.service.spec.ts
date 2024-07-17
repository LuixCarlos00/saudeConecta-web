/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { ApiUrlService } from './Api-Url.service';

describe('Service: ApiUrl', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ApiUrlService]
    });
  });

  it('should ...', inject([ApiUrlService], (service: ApiUrlService) => {
    expect(service).toBeTruthy();
  }));
});
