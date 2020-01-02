import { Injectable } from '@angular/core';
import { Renderer, RenderContext } from './renderer.interface';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { FLEET_VS_SOURCE, FLEET_FS_SOURCE } from './shaders/fleet-shader';
import { FLEET_VERTICES } from './shapes/fleet-vertices';
import { Fleet } from '../../model/fleet';
import { ColorService } from '../color.service';

@Injectable({
  providedIn: 'root'
})
export class FleetRendererService implements Renderer{

  program: WebGLShader;
  vao: WebGLVertexArrayObjectOES;
  aspectUniformLocation: WebGLUniformLocation;
  scaleUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  angleUniformLocation: WebGLUniformLocation;
  colorUniformLocation: WebGLUniformLocation;

  constructor(
    private shaderCompiler: ShaderCompilerService,
    private colorService: ColorService
  ) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, FLEET_VS_SOURCE, FLEET_FS_SOURCE);

    this.vao = (gl as any).createVertexArray();
    (gl as any).bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(FLEET_VERTICES), gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(this.program, 'position');
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);

    this.angleUniformLocation = gl.getUniformLocation(this.program, 'angle');
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

  render(entities: Fleet[] | Set<Fleet>, context: RenderContext): void {
    this.prepare(context);
    const gl = context.gl;
    const camera = context.camera;
    const zoom = context.camera.zoom;

    entities.forEach(
      fleet => {
        const scale = this.getRenderScale(fleet, zoom);

        const { r, g, b } = this.colorService.getCivilizationColor(fleet.civilization.id);
        const angle = fleet.angle;

        gl.uniform1f(this.scaleUniformLocation, scale);
        gl.uniform2f(this.positionUniformLocation, fleet.x - camera.x, fleet.y - camera.y);
        gl.uniform1f(this.angleUniformLocation, -angle);
        gl.uniform3f(this.colorUniformLocation, r, g, b);

        gl.drawArrays(gl.TRIANGLES, 0, 90);
      }
    );
  }

  getRenderScale(fleet: Fleet, zoom: number): number {
    return (0.02) / zoom + (0.0005);
  }
}
