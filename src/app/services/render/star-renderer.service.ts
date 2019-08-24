import { Injectable } from '@angular/core';
import { Renderer, RenderContext, Entity } from './renderer.interface';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { STAR_SYSTEM_VS_SOURCE, STAR_SYSTEM_FS_SOURCE } from './shaders/star-system-shader';
import { STAR_RENDER_SCALE_ZI, STAR_RENDER_SCALE_ZI_SI, STAR_RENDER_SCALE_ZD, STAR_COLORS } from 'src/app/galaxy-constants';
import { StarSystem } from '../../model/star-system';

@Injectable({
  providedIn: 'root'
})
export class StarRendererService implements Renderer{

  program: WebGLShader;
  vao: WebGLVertexArrayObjectOES;
  timeUniformLocation: WebGLUniformLocation;
  aspectUniformLocation: WebGLUniformLocation;
  scaleUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  colorUniformLocation: WebGLUniformLocation;

  constructor(private shaderCompiler: ShaderCompilerService) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, STAR_SYSTEM_VS_SOURCE, STAR_SYSTEM_FS_SOURCE);

    this.vao = (gl as any).createVertexArray();
    (gl as any).bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0,  -1, -1, 0,  1, -1, 0,  1, 1, 0, -1, 1, 0, 1, -1, 0]), gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(this.program, 'position');
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    this.timeUniformLocation = gl.getUniformLocation(this.program, 'time');
    this.aspectUniformLocation = gl.getUniformLocation(this.program, 'aspect');
    this.scaleUniformLocation = gl.getUniformLocation(this.program, 'scale');
    this.zoomUniformLocation = gl.getUniformLocation(this.program, 'zoom');
    this.positionUniformLocation = gl.getUniformLocation(this.program, 'pos');
    this.colorUniformLocation = gl.getUniformLocation(this.program, 'color');
  }

  prepare(context: RenderContext): void {
    const camera = context.camera;
    const aspect = context.aspectRatio;
    const gl = context.gl;
    const gl2 = <any>gl;
    const zoom = camera.zoom;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.program);
    gl2.bindVertexArray(this.vao);

    const time = (656454 % (Math.PI * 2000)) * 0.001;

    gl.uniform1f(this.timeUniformLocation, time);
    gl.uniform1f(this.zoomUniformLocation, zoom);
    gl.uniform1f(this.aspectUniformLocation, aspect);
  }

  render(entities: StarSystem[], context: RenderContext): void {
    this.prepare(context);
    const gl = context.gl;
    const camera = context.camera;
    const zoom = context.camera.zoom;

    entities.forEach(
      star => {
        const scale = this.getRenderScale(star, zoom);
        const color = STAR_COLORS[star.type - 1];

        gl.uniform1f(this.scaleUniformLocation, scale);
        gl.uniform2f(this.positionUniformLocation, star.x - camera.x, star.y - camera.y);
        gl.uniform3f(this.colorUniformLocation, color.r, color.g, color.b);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    );
  }

  getRenderScale(star: StarSystem, zoom: number): number {
    return (STAR_RENDER_SCALE_ZI * star.size * star.size + STAR_RENDER_SCALE_ZI_SI) / zoom + STAR_RENDER_SCALE_ZD;
  }

}
