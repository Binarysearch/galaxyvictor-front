import { TestBed } from '@angular/core/testing';

import { HoverService } from './hover.service';

describe('HoverService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HoverService = TestBed.get(HoverService);
    expect(service).toBeTruthy();
  });
});
