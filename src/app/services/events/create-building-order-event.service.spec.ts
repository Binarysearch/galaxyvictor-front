import { TestBed } from '@angular/core/testing';

import { CreateBuildingOrderEventService } from './create-building-order-event.service';

describe('CreateBuildingOrderEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: CreateBuildingOrderEventService = TestBed.get(CreateBuildingOrderEventService);
    expect(service).toBeTruthy();
  });
});
