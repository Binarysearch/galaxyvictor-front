import { Injectable } from '@angular/core';
import { LogService } from '../log.service';

@Injectable({
  providedIn: 'root'
})
export class ShaderCompilerService {

  constructor(private log: LogService) { }

  createShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLShader{
    const vertShader = gl.createShader(WebGLRenderingContext.VERTEX_SHADER);
    gl.shaderSource(vertShader, vsSource);
    gl.compileShader(vertShader);
    var compilationLog = gl.getShaderInfoLog(vertShader);
    if(compilationLog.trim() != ''){
        this.log.i('Vertex Shader compiler log: ' + compilationLog);
    }

    const fragShader = gl.createShader(WebGLRenderingContext.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fsSource);
    gl.compileShader(fragShader);
    var compilationLog2 = gl.getShaderInfoLog(fragShader);
    if(compilationLog2.trim() != ''){
      this.log.i('Fragment Shader compiler log: ' + compilationLog2);
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    
    return prog;
  }
}
