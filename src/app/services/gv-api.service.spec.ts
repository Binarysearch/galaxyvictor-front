import { TestBed } from '@angular/core/testing';

import { GvApiService } from './gv-api.service';

describe('GvApiService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: GvApiService = TestBed.get(GvApiService);
    expect(service).toBeTruthy();
  });
});
