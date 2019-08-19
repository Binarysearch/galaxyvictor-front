import { TestBed } from '@angular/core/testing';

import { HoverRendererService } from './hover-renderer.service';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { RenderContext } from './renderer.interface';
import { Camera } from './camera';

describe('HoverRendererService', () => {

  let glSpy: jasmine.SpyObj<WebGLRenderingContext>;
  let compilerSpy: jasmine.SpyObj<ShaderCompilerService>;
  
  beforeEach(() => {

    glSpy = jasmine.createSpyObj('WebGLRenderingContext', [
      'createVertexArray',
      'bindVertexArray',
      'bindBuffer',
      'enable',
      'drawArrays',
      'blendFunc',
      'uniform1f',
      'uniform2f',
      'uniform3f',
      'useProgram',
      'bufferData',
      'createBuffer',
      'getAttribLocation',
      'enableVertexAttribArray',
      'vertexAttribPointer',
      'getUniformLocation',
    ]);
    compilerSpy = jasmine.createSpyObj('ShaderCompilerService', ['createShaderProgram']);

    TestBed.configureTestingModule({
      providers: [
        { provide: ShaderCompilerService, useValue: compilerSpy }
      ]
    });

  });

  it('should be created', () => {
    const service: HoverRendererService = TestBed.get(HoverRendererService);
    expect(service).toBeTruthy();
  });

  it('should setup', () => {
    const service: HoverRendererService = TestBed.get(HoverRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.prepare(context);

  });

  it('should prepare', () => {
    const service: HoverRendererService = TestBed.get(HoverRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.setup(context);

  });

  it('should render', () => {
    const service: HoverRendererService = TestBed.get(HoverRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.render([{ x: 0, y: 0, id: '' }], context);

  });


});
