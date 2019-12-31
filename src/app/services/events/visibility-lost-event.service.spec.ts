import { TestBed } from '@angular/core/testing';

import { VisibilityLostEventService } from './visibility-lost-event.service';

describe('VisibilityLostEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisibilityLostEventService = TestBed.get(VisibilityLostEventService);
    expect(service).toBeTruthy();
  });
});
