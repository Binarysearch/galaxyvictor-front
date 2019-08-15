import { TestBed } from '@angular/core/testing';

import { StarRendererService } from './star-renderer.service';

describe('StarRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: StarRendererService = TestBed.get(StarRendererService);
    expect(service).toBeTruthy();
  });
});
