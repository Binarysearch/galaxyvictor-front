import { TestBed } from '@angular/core/testing';

import { EndTravelEventService } from './end-travel-event.service';

describe('EndTravelEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: EndTravelEventService = TestBed.get(EndTravelEventService);
    expect(service).toBeTruthy();
  });
});
