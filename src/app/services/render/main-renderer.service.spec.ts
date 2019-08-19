import { TestBed } from '@angular/core/testing';

import { MainRendererService } from './main-renderer.service';
import { StarRendererService } from './star-renderer.service';
import { RenderContext } from './renderer.interface';
import { Camera } from './camera';
import { HoverRendererService } from './hover-renderer.service';
import { StarSystemsService } from '../data/star-systems.service';
import { of } from 'rxjs';
import { HoverService } from '../hover.service';

describe('MainRendererService', () => {

  let glSpy: jasmine.SpyObj<WebGLRenderingContext>;
  let windowSpy: jasmine.SpyObj<Window>;
  let starRendererSpy: jasmine.SpyObj<StarRendererService>;
  let hoverRendererSpy: jasmine.SpyObj<HoverRendererService>;
  let starsServiceSpy: jasmine.SpyObj<StarSystemsService>;
  let hoverServiceSpy: jasmine.SpyObj<HoverService>;

  beforeEach(() => {

    glSpy = jasmine.createSpyObj('WebGLRenderingContext', ['viewport', 'clearColor', 'clear']);
    windowSpy = jasmine.createSpyObj('Window', ['requestAnimationFrame']);
    starRendererSpy = jasmine.createSpyObj('StarRendererService', ['setup', 'prepare', 'render']);
    hoverRendererSpy = jasmine.createSpyObj('HoverRendererService', ['setup', 'prepare', 'render']);
    starsServiceSpy = jasmine.createSpyObj('StarSystemsService', ['getStarSystems']);
    hoverServiceSpy = jasmine.createSpyObj('HoverService', ['hovered']);

    TestBed.configureTestingModule({
      providers: [
        { provide: 'Window', useValue: windowSpy },
        { provide: WebGLRenderingContext, useValue: glSpy },
        { provide: StarRendererService, useValue: starRendererSpy },
        { provide: HoverRendererService, useValue: hoverRendererSpy },
        { provide: StarSystemsService, useValue: starsServiceSpy },
        { provide: HoverService, useValue: hoverServiceSpy }
      ]
    });

    starsServiceSpy.getStarSystems.and.returnValue(of([]));

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
    expect(starRendererSpy.prepare).toHaveBeenCalledWith(context);
    
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
    service.setSelectedId({ x: 0, y: 0 });
    
    const animate = windowSpy.requestAnimationFrame.calls.argsFor(0)[0];


    expect(hoverRendererSpy.render).toHaveBeenCalledWith([], context);

    animate(0);

    expect(hoverRendererSpy.render).toHaveBeenCalledWith([{ x: 0, y: 0 }], context);

  });


});
