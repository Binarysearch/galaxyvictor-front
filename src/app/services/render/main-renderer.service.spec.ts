import { TestBed } from '@angular/core/testing';

import { MainRendererService } from './main-renderer.service';
import { StarRendererService } from './star-renderer.service';
import { RenderContext } from './renderer.interface';
import { Camera } from './camera';
import { HoverRendererService } from './hover-renderer.service';
import { of } from 'rxjs';
import { HoverService } from '../hover.service';
import { Store } from '../data/store';
import { PlanetRendererService } from './planet-renderer.service';

describe('MainRendererService', () => {

  let glSpy: jasmine.SpyObj<WebGLRenderingContext>;
  let windowSpy: jasmine.SpyObj<Window>;
  let starRendererSpy: jasmine.SpyObj<StarRendererService>;
  let planetRendererSpy: jasmine.SpyObj<PlanetRendererService>;
  let hoverRendererSpy: jasmine.SpyObj<HoverRendererService>;
  let storeSpy: jasmine.SpyObj<Store>;
  let hoverServiceSpy: jasmine.SpyObj<HoverService>;

  beforeEach(() => {

    glSpy = jasmine.createSpyObj('WebGLRenderingContext', ['viewport', 'clearColor', 'clear']);
    windowSpy = jasmine.createSpyObj('Window', ['requestAnimationFrame']);
    starRendererSpy = jasmine.createSpyObj('StarRendererService', ['setup', 'prepare', 'render']);
    planetRendererSpy = jasmine.createSpyObj('PlanetRendererService', ['setup', 'prepare', 'render']);
    hoverRendererSpy = jasmine.createSpyObj('HoverRendererService', ['setup', 'prepare', 'render']);
    hoverServiceSpy = jasmine.createSpyObj('HoverService', ['hovered']);
    storeSpy = jasmine.createSpyObj('Store', ['getEntity', 'getStarSystems', 'getPlanets']);

    TestBed.configureTestingModule({
      providers: [
        { provide: 'Window', useValue: windowSpy },
        { provide: WebGLRenderingContext, useValue: glSpy },
        { provide: StarRendererService, useValue: starRendererSpy },
        { provide: PlanetRendererService, useValue: planetRendererSpy },
        { provide: HoverRendererService, useValue: hoverRendererSpy },
        { provide: Store, useValue: storeSpy },
        { provide: HoverService, useValue: hoverServiceSpy }
      ]
    });

    storeSpy.getStarSystems.and.returnValue(of([]));
    storeSpy.getPlanets.and.returnValue(of([]));

  });

  it('should be created', () => {
    const service: MainRendererService = TestBed.get(MainRendererService);
    expect(service).toBeTruthy();
  });

  it('should start animation on init', () => {
    const service: MainRendererService = TestBed.get(MainRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.init(context);

    expect(windowSpy.requestAnimationFrame).toHaveBeenCalledTimes(1);

    windowSpy.requestAnimationFrame();

    expect(windowSpy.requestAnimationFrame).toHaveBeenCalledTimes(2);

    expect(starRendererSpy.setup).toHaveBeenCalledWith(context);
    expect(starRendererSpy.render).toHaveBeenCalledWith([], context);
    
  });

  it('should change viewport on setViewport', () => {
    const service: MainRendererService = TestBed.get(MainRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.init(context);

    service.setViewport(4, 5);
    expect(glSpy.viewport).toHaveBeenCalledWith(0, 0, 4, 5);

    expect(context.aspectRatio).toEqual(4 / 5);

  });

  it('should render selected', () => {

    Object.defineProperty(hoverServiceSpy, 'hovered', { value: undefined });
    const service: MainRendererService = TestBed.get(MainRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };


    windowSpy.requestAnimationFrame.calls.reset();
    hoverRendererSpy.render.calls.reset();

    service.init(context);
    service.setSelectedId('selected');
    
    const animate = windowSpy.requestAnimationFrame.calls.argsFor(0)[0];

    storeSpy.getEntity.withArgs('selected').and.returnValue({ x: 0, y: 0, id: 'a'});
    expect(hoverRendererSpy.render).toHaveBeenCalledWith([], context);

    animate(0);

    expect(hoverRendererSpy.render).toHaveBeenCalledWith([{ x: 0, y: 0, id: 'a'}], context);

  });


});
