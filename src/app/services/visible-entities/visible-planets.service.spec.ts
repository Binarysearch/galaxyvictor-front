import { TestBed } from '@angular/core/testing';

import { VisiblePlanetsService } from './visible-planets.service';

describe('VisiblePlanetsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisiblePlanetsService = TestBed.get(VisiblePlanetsService);
    expect(service).toBeTruthy();
  });
});
