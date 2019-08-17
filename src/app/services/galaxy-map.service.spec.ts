import { TestBed } from '@angular/core/testing';

import { GalaxyMapService } from './galaxy-map.service';

describe('GalaxyMapService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    expect(service).toBeTruthy();
  });
});
