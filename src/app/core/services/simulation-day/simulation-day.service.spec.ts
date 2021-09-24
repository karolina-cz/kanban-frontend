import { TestBed } from '@angular/core/testing';

import { SimulationDayService } from './simulation-day.service';

describe('SimulationDayService', () => {
  let service: SimulationDayService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SimulationDayService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
