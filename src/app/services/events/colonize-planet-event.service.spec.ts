import { TestBed } from '@angular/core/testing';

import { ColonizePlanetEventService } from './colonize-planet-event.service';

describe('ColonizePlanetEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColonizePlanetEventService = TestBed.get(ColonizePlanetEventService);
    expect(service).toBeTruthy();
  });
});
