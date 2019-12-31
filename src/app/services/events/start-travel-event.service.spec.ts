import { TestBed } from '@angular/core/testing';

import { StartTravelEventService } from './start-travel-event.service';

describe('StartTravelEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StartTravelEventService = TestBed.get(StartTravelEventService);
    expect(service).toBeTruthy();
  });
});
