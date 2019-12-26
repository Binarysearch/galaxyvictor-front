import { TestBed } from '@angular/core/testing';

import { ColonyRendererService } from './colony-renderer.service';

describe('ColonyRendererService', () => {
  beforeEach(() => TestBed.configureTestingModule({}));

  it('should be created', () => {
    const service: ColonyRendererService = TestBed.get(ColonyRendererService);
    expect(service).toBeTruthy();
  });
});
