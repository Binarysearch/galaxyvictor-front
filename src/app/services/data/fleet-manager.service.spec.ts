import { TestBed } from '@angular/core/testing';

import { FleetManagerService } from './fleet-manager.service';

describe('FleetManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FleetManagerService = TestBed.get(FleetManagerService);
    expect(service).toBeTruthy();
  });
});
