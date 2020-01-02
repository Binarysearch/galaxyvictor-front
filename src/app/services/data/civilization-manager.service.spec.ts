import { TestBed } from '@angular/core/testing';

import { CivilizationManagerService } from './civilization-manager.service';

describe('CivilizationManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CivilizationManagerService = TestBed.get(CivilizationManagerService);
    expect(service).toBeTruthy();
  });
});
