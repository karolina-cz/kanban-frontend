import { TestBed } from '@angular/core/testing';

import { WorkPointService } from './work-point.service';

describe('WorkPointService', () => {
  let service: WorkPointService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(WorkPointService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
