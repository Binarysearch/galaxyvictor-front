import { TestBed } from '@angular/core/testing';

import { PlanetManagerService } from './planet-manager.service';

describe('PlanetManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanetManagerService = TestBed.get(PlanetManagerService);
    expect(service).toBeTruthy();
  });
});
