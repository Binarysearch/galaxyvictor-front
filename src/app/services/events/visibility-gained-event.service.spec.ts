import { TestBed } from '@angular/core/testing';

import { VisibilityGainedEventService } from './visibility-gained-event.service';

describe('VisibilityGainedEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisibilityGainedEventService = TestBed.get(VisibilityGainedEventService);
    expect(service).toBeTruthy();
  });
});
