import { TestBed } from '@angular/core/testing';

import { HoverService } from './hover.service';
import { StarRendererService } from './render/star-renderer.service';
import { StarSystemsService } from './data/star-systems.service';
import { of } from 'rxjs';
import { RenderContext } from './render/renderer.interface';
import { Camera } from './render/camera';

describe('HoverService', () => {

  let starRendererSpy: jasmine.SpyObj<StarRendererService>;
  let starServiceSpy: jasmine.SpyObj<StarSystemsService>;


  beforeEach(() => {

    starRendererSpy = jasmine.createSpyObj('StarRendererService', ['getRenderScale']);
    starServiceSpy = jasmine.createSpyObj('StarSystemsService', ['getStarSystems']);

    TestBed.configureTestingModule({
      providers: [
        { provide: StarRendererService, useValue: starRendererSpy },
        { provide: StarSystemsService, useValue: starServiceSpy }
      ]
    });

    starServiceSpy.getStarSystems.and.returnValue(of([]));
    
  });

  it('should be created', () => {
    const service: HoverService = TestBed.get(HoverService);
    expect(service).toBeTruthy();
  });

  it('should detect hover on star when mouse moved over a star', () => {

    const star = { x: 0, y: 0, type: 1, size: 2, id: '' };

    starServiceSpy.getStarSystems.and.returnValue(of([
      star,
      { x: 0.05, y: 0, type: 1, size: 2, id: '' },
      { x: 10, y: 10, type: 1, size: 2, id: '' }
    ]));

    const service: HoverService = TestBed.get(HoverService);
    
    const context: RenderContext = {
      gl: null,
      aspectRatio: 1.333,
      camera: new Camera()
    };
    
    starRendererSpy.getRenderScale.and.returnValue(0.1);

    service.mouseMoved(0, 0, context);

    expect(service.hovered).toEqual(star);

  });


});
