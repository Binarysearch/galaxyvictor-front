import { TestBed } from '@angular/core/testing';

import { StarSystemsService } from './star-systems.service';

describe('StarSystemsService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarSystemsService = TestBed.get(StarSystemsService);
    expect(service).toBeTruthy();
  });
});
