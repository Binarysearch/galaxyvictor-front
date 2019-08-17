import { TestBed } from '@angular/core/testing';

import { GalaxyMapService } from './galaxy-map.service';
import { MainRendererService } from './render/main-renderer.service';

describe('GalaxyMapService', () => {

  let rendererSpy: jasmine.SpyObj<MainRendererService>;

  beforeEach(() => {

    rendererSpy = jasmine.createSpyObj('MainRendererService', ['init', 'setViewport']);

    TestBed.configureTestingModule({
      providers: [
        { provide: MainRendererService, useValue: rendererSpy }
      ]
    });


  });

  it('should be created', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    expect(service).toBeTruthy();
  });
});
