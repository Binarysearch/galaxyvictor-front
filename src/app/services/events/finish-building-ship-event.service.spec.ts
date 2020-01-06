import { TestBed } from '@angular/core/testing';

import { FinishBuildingShipEventService } from './finish-building-ship-event.service';

describe('FinishBuildingShipEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: FinishBuildingShipEventService = TestBed.get(FinishBuildingShipEventService);
    expect(service).toBeTruthy();
  });
});
