import { Injectable } from '@angular/core';
import { Renderer, RenderContext } from './renderer.interface';
import { PLANET_VS_SOURCE, PLANET_FS_SOURCE } from './shaders/planet-shader';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { Planet } from 'src/app/model/planet';
import { PLANET_COLORS, PLANET_RENDER_SCALE_ZI, PLANET_RENDER_SCALE_ZD, PLANET_RENDER_SCALE_ZI_SI, MIN_ZOOM_TO_VIEW_PLANETS } from 'src/app/galaxy-constants';

@Injectable({
  providedIn: 'root'
})
export class PlanetRendererService implements Renderer{

  program: WebGLShader;
  vao: WebGLVertexArrayObjectOES;
  aspectUniformLocation: WebGLUniformLocation;
  scaleUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  starPositionUniformLocation: WebGLUniformLocation;
  colorUniformLocation: WebGLUniformLocation;

  constructor(private shaderCompiler: ShaderCompilerService) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, PLANET_VS_SOURCE, PLANET_FS_SOURCE);

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
    this.starPositionUniformLocation = gl.getUniformLocation(this.program, 'starPosition');
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

  render(entities: Planet[], context: RenderContext): void {
    if (context.camera.zoom < MIN_ZOOM_TO_VIEW_PLANETS) {
      return;
    }
    this.prepare(context);
    const gl = context.gl;
    const camera = context.camera;
    const zoom = context.camera.zoom;

    entities.forEach(
      planet => {
        const scale = this.getRenderScale(planet, zoom);

        const color = PLANET_COLORS[planet.type - 1];
        const angle = planet.angle;
    
        gl.uniform1f(this.scaleUniformLocation, scale);
        gl.uniform2f(this.positionUniformLocation, planet.x - camera.x, planet.y - camera.y);
        gl.uniform2f(this.starPositionUniformLocation, -Math.cos(angle), -Math.sin(angle));
        gl.uniform3f(this.colorUniformLocation, color.r, color.g, color.b);
    
        gl.drawArrays(gl.TRIANGLES, 0, 6);
      }
    );
  }

  getRenderScale(planet: Planet, zoom: number): number {
    const scale = (PLANET_RENDER_SCALE_ZI * planet.size * planet.size + PLANET_RENDER_SCALE_ZI_SI)
      / zoom + (PLANET_RENDER_SCALE_ZD * planet.size * planet.size);
    return scale;
  }
}
