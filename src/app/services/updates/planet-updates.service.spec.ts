import { TestBed } from '@angular/core/testing';

import { PlanetUpdatesService } from './planet-updates.service';

describe('PlanetUpdatesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanetUpdatesService = TestBed.get(PlanetUpdatesService);
    expect(service).toBeTruthy();
  });
});
