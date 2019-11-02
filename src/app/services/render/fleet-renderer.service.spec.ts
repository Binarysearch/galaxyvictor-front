import { TestBed } from '@angular/core/testing';

import { FleetRendererService } from './fleet-renderer.service';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { RenderContext } from './renderer.interface';
import { Camera } from './camera';

describe('FleetRendererService', () => {

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
    const service: FleetRendererService = TestBed.get(FleetRendererService);
    expect(service).toBeTruthy();
  });

  it('should setup', () => {
    const service: FleetRendererService = TestBed.get(FleetRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.prepare(context);

  });


  it('should prepare', () => {
    const service: FleetRendererService = TestBed.get(FleetRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: new Camera()
    };

    service.setup(context);

  });

});
