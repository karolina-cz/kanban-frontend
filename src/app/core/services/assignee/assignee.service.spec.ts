import { TestBed } from '@angular/core/testing';

import { AssigneeService } from './assignee.service';

describe('AssigneeService', () => {
  let service: AssigneeService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AssigneeService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
