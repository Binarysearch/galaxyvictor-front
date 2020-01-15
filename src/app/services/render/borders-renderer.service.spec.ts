import { TestBed } from '@angular/core/testing';

import { BordersRendererService } from './borders-renderer.service';

describe('BordersRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: BordersRendererService = TestBed.get(BordersRendererService);
    expect(service).toBeTruthy();
  });
});
