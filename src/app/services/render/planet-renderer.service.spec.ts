import { TestBed } from '@angular/core/testing';

import { PlanetRendererService } from './planet-renderer.service';

describe('PlanetRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: PlanetRendererService = TestBed.get(PlanetRendererService);
    expect(service).toBeTruthy();
  });
});
