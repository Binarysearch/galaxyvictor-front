import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class ShaderCompilerService {

  constructor() { }

  createShaderProgram(gl: WebGLRenderingContext, vsSource: string, fsSource: string): WebGLShader{
    const vertShader = gl.createShader(gl.VERTEX_SHADER);
    gl.shaderSource(vertShader, vsSource);
    gl.compileShader(vertShader);
    var compilationLog = gl.getShaderInfoLog(vertShader);
    if(compilationLog.trim() != ''){
        console.log('Shader compiler log: ' + compilationLog);
    }

    const fragShader = gl.createShader(gl.FRAGMENT_SHADER);
    gl.shaderSource(fragShader, fsSource);
    gl.compileShader(fragShader);
    var compilationLog2 = gl.getShaderInfoLog(fragShader);
    if(compilationLog2.trim() != ''){
        console.log('Shader compiler log: ' + compilationLog2);
    }
    const prog = gl.createProgram();
    gl.attachShader(prog, vertShader);
    gl.attachShader(prog, fragShader);
    gl.linkProgram(prog);
    
    return prog;
  }
}
