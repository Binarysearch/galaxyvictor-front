import { TestBed } from '@angular/core/testing';

import { ShipsService } from './ships.service';

describe('ShipsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ShipsService = TestBed.get(ShipsService);
    expect(service).toBeTruthy();
  });
});
