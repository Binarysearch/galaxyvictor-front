import { TestBed } from '@angular/core/testing';

import { VisibleEntitiesService } from './visible-entities.service';

describe('VisibleEntitiesService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: VisibleEntitiesService = TestBed.get(VisibleEntitiesService);
    expect(service).toBeTruthy();
  });
});
