import { Injectable } from '@angular/core';
import { SegmentRenderer, RenderContext, Segment } from './renderer.interface';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { SEGMENT_VS_SOURCE, SEGMENT_FS_SOURCE } from './shaders/segment-shader';
import { FLEET_VERTICES } from './shapes/fleet-vertices';

@Injectable({
  providedIn: 'root'
})
export class LineRendererService implements SegmentRenderer{

  program: WebGLShader;
  vao: WebGLVertexArrayObjectOES;
  aspectUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  colorUniformLocation: WebGLUniformLocation;

  constructor(private shaderCompiler: ShaderCompilerService) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, SEGMENT_VS_SOURCE, SEGMENT_FS_SOURCE);

    this.vao = (gl as any).createVertexArray();
    (gl as any).bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([1,1, -1,-1]), gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(this.program, 'position');
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    this.aspectUniformLocation = gl.getUniformLocation(this.program, 'aspect');
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


    gl.uniform1f(this.zoomUniformLocation, zoom);
    gl.uniform1f(this.aspectUniformLocation, aspect);
  }

  render(segments: Segment[], context: RenderContext): void {
    this.prepare(context);
    const gl = context.gl;
    const camera = context.camera;
    const zoom = context.camera.zoom;

    segments.forEach(
      s => {

        gl.uniform4f(this.positionUniformLocation, s.x1 - camera.x, s.y1 - camera.y, s.x2 - camera.x, s.y2 - camera.y);
        gl.uniform4f(this.colorUniformLocation, 1, 1, 1, 0.1);

        gl.drawArrays(gl.LINES, 0, 2);
      }
    );
  }

}
