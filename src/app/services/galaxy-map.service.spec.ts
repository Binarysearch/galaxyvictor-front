import { TestBed } from '@angular/core/testing';

import { GalaxyMapService } from './galaxy-map.service';
import { MainRendererService } from './render/main-renderer.service';
import { HoverService } from './hover.service';

describe('GalaxyMapService', () => {

  let rendererSpy: jasmine.SpyObj<MainRendererService>;
  let hoverSpy: jasmine.SpyObj<HoverService>;
  let canvasSpy: jasmine.SpyObj<HTMLCanvasElement>;

  beforeEach(() => {

    hoverSpy = jasmine.createSpyObj('HoverService', ['mouseMoved', 'hovered']);
    rendererSpy = jasmine.createSpyObj('MainRendererService', ['init', 'setViewport', 'setSelected']);
    canvasSpy = jasmine.createSpyObj('HTMLCanvasElement', ['height', 'width', 'getContext', 'clientHeight', 'clientWidth']);

    TestBed.configureTestingModule({
      providers: [
        { provide: MainRendererService, useValue: rendererSpy },
        { provide: HoverService, useValue: hoverSpy }
      ]
    });


  });

  it('should be created', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    expect(service).toBeTruthy();
  });

  it('should create context and init renderer on set canvas', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    
    Object.defineProperty(canvasSpy, 'clientHeight', { value: 1 });
    Object.defineProperty(canvasSpy, 'height', { value: 1 });
    Object.defineProperty(canvasSpy, 'clientWidth', { value: 1 });
    Object.defineProperty(canvasSpy, 'width', { value: 1 });

    service.setCanvas(canvasSpy);

    Object.defineProperty(canvasSpy, 'clientHeight', { value: 1 });
    Object.defineProperty(canvasSpy, 'height', { value: 2 });
    Object.defineProperty(canvasSpy, 'clientWidth', { value: 1 });
    Object.defineProperty(canvasSpy, 'width', { value: 1 });

    service.setCanvas(canvasSpy);

    expect(rendererSpy.init).toHaveBeenCalledTimes(2);
    expect(rendererSpy.setViewport).toHaveBeenCalledTimes(2);
    
  });

  it('should call zoom in on mouse wheel up', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    
    service.setCanvas(canvasSpy);

    const context = service.getContext();

    context.camera = jasmine.createSpyObj('Camera', ['zoomIn']);
    
    service.onMouseWheel(<MouseWheelEvent>{ deltaY: -1 });

    expect(context.camera.zoomIn).toHaveBeenCalled();

  });

  it('should call zoom out on mouse wheel down', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    
    service.setCanvas(canvasSpy);

    const context = service.getContext();

    context.camera = jasmine.createSpyObj('Camera', ['zoomOut']);
    
    service.onMouseWheel(<MouseWheelEvent>{ deltaY: 1 });

    expect(context.camera.zoomOut).toHaveBeenCalled();

  });

  it('should select on click', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
        
    service.onMouseClick(undefined);

    expect(rendererSpy.setSelectedId).toHaveBeenCalled();

  });

  it('should ignore mouse down with secondary button', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
        
    service.onMouseDown(<MouseEvent>{ button: 2 });

  });

  it('should mouse down', () => {
    const service: GalaxyMapService = TestBed.get(GalaxyMapService);
    
    service.setCanvas(canvasSpy);
    
    service.onMouseDown(<MouseEvent>{ button: 1 });

  });


});
