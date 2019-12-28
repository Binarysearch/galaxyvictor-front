import { TestBed } from '@angular/core/testing';

import { VisibleStarsService } from './visible-stars.service';

describe('VisibleStarsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisibleStarsService = TestBed.get(VisibleStarsService);
    expect(service).toBeTruthy();
  });
});
