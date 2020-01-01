import { TestBed } from '@angular/core/testing';

import { DeleteFleetEventService } from './delete-fleet-event.service';

describe('DeleteFleetEventService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: DeleteFleetEventService = TestBed.get(DeleteFleetEventService);
    expect(service).toBeTruthy();
  });
});
