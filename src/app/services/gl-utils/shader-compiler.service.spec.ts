import { TestBed } from '@angular/core/testing';

import { ShaderCompilerService } from './shader-compiler.service';
import { LogService } from '../log.service';

describe('ShaderCompilerService', () => {

  let glSpy: jasmine.SpyObj<WebGLRenderingContext>;
  let logSpy: jasmine.SpyObj<LogService>;

  beforeEach(() => {

    logSpy = jasmine.createSpyObj('LogService', ['i']);

    glSpy = jasmine.createSpyObj('WebGLRenderingContext', [
      'createShader',
      'compileShader',
      'getShaderInfoLog',
      'attachShader',
      'createProgram',
      'linkProgram',
      'shaderSource'
    ]);

    TestBed.configureTestingModule({
      providers: [
        { provide: LogService, useValue: logSpy }
      ]
    });

  });

  it('should be created', () => {
    const service: ShaderCompilerService = TestBed.get(ShaderCompilerService);
    expect(service).toBeTruthy();
  });

  it('should create shader programs', () => {
    const service: ShaderCompilerService = TestBed.get(ShaderCompilerService);

    glSpy.createShader.withArgs(WebGLRenderingContext.VERTEX_SHADER).and.returnValue(1);
    glSpy.createShader.withArgs(WebGLRenderingContext.FRAGMENT_SHADER).and.returnValue(2);

    glSpy.getShaderInfoLog.withArgs(1).and.returnValue('');
    glSpy.getShaderInfoLog.withArgs(2).and.returnValue('');

    glSpy.createProgram.withArgs().and.returnValue(3);

    const program = service.createShaderProgram(glSpy, 'vs', 'fs');
    
    expect(glSpy.shaderSource).toHaveBeenCalledWith(1, 'vs');
    expect(glSpy.shaderSource).toHaveBeenCalledWith(2, 'fs');

    expect(glSpy.compileShader).toHaveBeenCalledWith(1);
    expect(glSpy.compileShader).toHaveBeenCalledWith(2);

    expect(glSpy.attachShader).toHaveBeenCalledWith(3, 1);
    expect(glSpy.attachShader).toHaveBeenCalledWith(3, 2);
    expect(glSpy.linkProgram).toHaveBeenCalledWith(3);

    expect(program).toEqual(3);

  });

  it('should log errors', () => {
    const service: ShaderCompilerService = TestBed.get(ShaderCompilerService);

    glSpy.createShader.withArgs(WebGLRenderingContext.VERTEX_SHADER).and.returnValue(1);
    glSpy.createShader.withArgs(WebGLRenderingContext.FRAGMENT_SHADER).and.returnValue(2);

    glSpy.getShaderInfoLog.withArgs(1).and.returnValue('Error in vertex shader');
    glSpy.getShaderInfoLog.withArgs(2).and.returnValue('Error in fragment shader');

    service.createShaderProgram(glSpy, 'vs', 'fs');
    
    expect(logSpy.i).toHaveBeenCalledWith('Vertex Shader compiler log: ' + 'Error in vertex shader');
    expect(logSpy.i).toHaveBeenCalledWith('Fragment Shader compiler log: ' + 'Error in fragment shader');

  });


});
