import { TestBed } from '@angular/core/testing';

import { ConstraintService } from './constraint.service';

describe('ConstraintService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ConstraintService = TestBed.get(ConstraintService);
    expect(service).toBeTruthy();
  });
});
