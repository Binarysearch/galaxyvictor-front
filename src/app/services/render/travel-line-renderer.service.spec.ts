import { TestBed } from '@angular/core/testing';

import { TravelLineRendererService } from './travel-line-renderer.service';

describe('TravelLineRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: TravelLineRendererService = TestBed.get(TravelLineRendererService);
    expect(service).toBeTruthy();
  });
});
