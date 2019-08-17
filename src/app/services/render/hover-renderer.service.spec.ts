import { TestBed } from '@angular/core/testing';

import { HoverRendererService } from './hover-renderer.service';

describe('HoverRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: HoverRendererService = TestBed.get(HoverRendererService);
    expect(service).toBeTruthy();
  });
});
