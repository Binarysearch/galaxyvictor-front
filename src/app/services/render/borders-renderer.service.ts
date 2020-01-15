import { Injectable } from '@angular/core';
import { Renderer, RenderContext } from './renderer.interface';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { BORDERS_VS_SOURCE, BORDERS_FS_SOURCE } from './shaders/borders-shader';
import { ColorService } from '../color.service';
import { BorderRect } from '../borders.service';

@Injectable({
  providedIn: 'root'
})
export class BordersRendererService implements Renderer {

  program: WebGLShader;
  vao: WebGLVertexArrayObjectOES;
  aspectUniformLocation: WebGLUniformLocation;
  scaleUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  colorUniformLocation: WebGLUniformLocation;

  constructor(
    private shaderCompiler: ShaderCompilerService,
    private colorService: ColorService
  ) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, BORDERS_VS_SOURCE, BORDERS_FS_SOURCE);

    this.vao = (gl as any).createVertexArray();
    (gl as any).bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, 1, 0,  -1, -1, 0,  1, -1, 0,  1, 1, 0, -1, 1, 0, 1, -1, 0]), gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(this.program, 'position');
    gl.vertexAttribPointer(coord, 3, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

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


    gl.uniform1f(this.zoomUniformLocation, zoom);
    gl.uniform1f(this.aspectUniformLocation, aspect);
  }

  render(entities: Set<BorderRect>, context: RenderContext): void {
    this.prepare(context);
    const gl = context.gl;
    const camera = context.camera;
    const zoom = context.camera.zoom;

    entities.forEach(
      rect => {
        if (rect.value < 1) return;
        const scale = this.getRenderScale(rect, zoom);
        //console.log(rect.tlp.x - camera.x, rect.tlp.y - camera.y, scale);
        const { r, g, b } = { r: 1, g: 0, b: 0 };

        const x = (rect.tlp.x + rect.brp.x) / 2;
        const y = (rect.tlp.y + rect.brp.y) / 2;

        gl.uniform1f(this.scaleUniformLocation, scale);
        gl.uniform2f(this.positionUniformLocation,  x - camera.x, y - camera.y);
        gl.uniform3f(this.colorUniformLocation, r, g, b);

        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    );
  }

  getRenderScale(rect: BorderRect, zoom: number): number {
    return (rect.tlp.x - rect.brp.x)/2;
  }
}
