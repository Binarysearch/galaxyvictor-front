import { TestBed } from '@angular/core/testing';

import { MainRendererService } from './main-renderer.service';
import { StarRendererService } from './star-renderer.service';
import { RenderContext } from './renderer.interface';

describe('MainRendererService', () => {

  let glSpy: jasmine.SpyObj<WebGLRenderingContext>;
  let windowSpy: jasmine.SpyObj<Window>;
  let starRendererSpy: jasmine.SpyObj<StarRendererService>;

  beforeEach(() => {

    glSpy = jasmine.createSpyObj('WebGLRenderingContext', ['viewport', 'clearColor', 'clear']);
    windowSpy = jasmine.createSpyObj('Window', ['requestAnimationFrame']);
    starRendererSpy = jasmine.createSpyObj('StarRendererService', ['setup', 'prepare', 'render']);

    TestBed.configureTestingModule({
      providers: [
        { provide: 'Window', useValue: windowSpy },
        { provide: WebGLRenderingContext, useValue: glSpy },
        { provide: StarRendererService, useValue: starRendererSpy }
      ]
    });

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
      camera: {
        zoom: 1,
        x: 0,
        y: 0
      }
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
      camera: {
        zoom: 1,
        x: 0,
        y: 0
      }
    };

    service.init(context);

    service.setViewport(4, 5);
    expect(glSpy.viewport).toHaveBeenCalledWith(0, 0, 4, 5);

    expect(context.aspectRatio).toEqual(4 / 5);

  });


});
