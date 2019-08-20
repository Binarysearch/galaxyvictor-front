import { TestBed } from '@angular/core/testing';

import { FleetRendererService } from './fleet-renderer.service';

describe('FleetRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetRendererService = TestBed.get(FleetRendererService);
    expect(service).toBeTruthy();
  });
});
