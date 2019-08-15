import { TestBed } from '@angular/core/testing';

import { MainRendererService } from './main-renderer.service';

describe('MainRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: MainRendererService = TestBed.get(MainRendererService);
    expect(service).toBeTruthy();
  });
});
