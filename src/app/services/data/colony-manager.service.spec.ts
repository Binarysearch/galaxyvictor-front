import { TestBed } from '@angular/core/testing';

import { ColonyManagerService } from './colony-manager.service';

describe('ColonyManagerService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColonyManagerService = TestBed.get(ColonyManagerService);
    expect(service).toBeTruthy();
  });
});
