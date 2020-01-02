import { TestBed } from '@angular/core/testing';

import { GalaxyManagerService } from './galaxy-manager.service';

describe('GalaxyManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GalaxyManagerService = TestBed.get(GalaxyManagerService);
    expect(service).toBeTruthy();
  });
});
