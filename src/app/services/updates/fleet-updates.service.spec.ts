import { TestBed } from '@angular/core/testing';

import { FleetUpdatesService } from './fleet-updates.service';

describe('FleetUpdatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetUpdatesService = TestBed.get(FleetUpdatesService);
    expect(service).toBeTruthy();
  });
});
