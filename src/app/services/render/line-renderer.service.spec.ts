import { TestBed } from '@angular/core/testing';

import { LineRendererService } from './line-renderer.service';

describe('TravelLineRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: LineRendererService = TestBed.get(LineRendererService);
    expect(service).toBeTruthy();
  });
});
