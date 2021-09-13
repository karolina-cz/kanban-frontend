import { TestBed } from '@angular/core/testing';

import { ColumnLimitService } from './column-limit.service';

describe('ColumnLimitService', () => {
  let service: ColumnLimitService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ColumnLimitService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
