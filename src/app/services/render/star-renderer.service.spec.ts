import { TestBed } from '@angular/core/testing';

import { StarRendererService } from './star-renderer.service';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { RenderContext } from './renderer.interface';

describe('StarRendererService', () => {

  let glSpy: jasmine.SpyObj<WebGLRenderingContext>;
  let compilerSpy: jasmine.SpyObj<ShaderCompilerService>;

  beforeEach(() => {

    glSpy = jasmine.createSpyObj('WebGLRenderingContext', [
      'createVertexArray',
      'bindVertexArray',
      'bindBuffer',
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
    const service: StarRendererService = TestBed.get(StarRendererService);
    expect(service).toBeTruthy();
  });

  it('should setup', () => {
    const service: StarRendererService = TestBed.get(StarRendererService);
    
    const context: RenderContext = {
      gl: glSpy,
      aspectRatio: 1.333,
      camera: {
        zoom: 1,
        x: 0,
        y: 0
      }
    };

    service.setup(context);

  });


});
