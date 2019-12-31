import { TestBed } from '@angular/core/testing';

import { ExploreStarSystemEventService } from './explore-star-system-event.service';

describe('ExploreStarSystemEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ExploreStarSystemEventService = TestBed.get(ExploreStarSystemEventService);
    expect(service).toBeTruthy();
  });
});
