import { TestBed } from '@angular/core/testing';

import { MapActionResolverService } from './map-action-resolver.service';

describe('MapActionResolverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MapActionResolverService = TestBed.get(MapActionResolverService);
    expect(service).toBeTruthy();
  });
});
