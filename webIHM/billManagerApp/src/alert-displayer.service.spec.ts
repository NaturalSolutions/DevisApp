import { TestBed, inject } from '@angular/core/testing';

import { AlertDisplayerService } from './alert-displayer.service';

describe('AlertDisplayerService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [AlertDisplayerService]
    });
  });

  it('should be created', inject([AlertDisplayerService], (service: AlertDisplayerService) => {
    expect(service).toBeTruthy();
  }));
});
