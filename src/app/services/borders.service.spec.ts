import { TestBed } from '@angular/core/testing';

import { BordersService } from './borders.service';

describe('BordersService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BordersService = TestBed.get(BordersService);
    expect(service).toBeTruthy();
  });
});
