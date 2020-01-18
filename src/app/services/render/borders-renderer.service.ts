import { Injectable } from '@angular/core';
import { Renderer, RenderContext } from './renderer.interface';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { BORDERS_VS_SOURCE, BORDERS_FS_SOURCE } from './shaders/borders-shader';
import { ColorService } from '../color.service';
import { BorderRect } from '../borders.service';
import { Store } from '../data/store';

@Injectable({
  providedIn: 'root'
})
export class BordersRendererService {

  program: WebGLShader;
  aspectUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  borderChunks: BordersChunk[] = [];
  backgroundBorderChunks: BordersChunk[] = [];

  private worker: Worker;

  constructor(
    private shaderCompiler: ShaderCompilerService,
    private colorService: ColorService,
    private store: Store
  ) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, BORDERS_VS_SOURCE, BORDERS_FS_SOURCE);

    this.aspectUniformLocation = gl.getUniformLocation(this.program, 'aspect');
    this.zoomUniformLocation = gl.getUniformLocation(this.program, 'zoom');
    this.positionUniformLocation = gl.getUniformLocation(this.program, 'pos');


    this.store.getColonies().subscribe(colonies => {

      const civilizationColors: Map<string, {r: number; g: number; b: number; }> = new Map();
      colonies.forEach(c => civilizationColors.set(c.civilization.id, this.colorService.getCivilizationColor(c.civilization.id)));

      if (this.worker) {
        this.worker.terminate();
      }

      this.worker = new Worker('../../workers/border-generator.worker', { type: 'module' });
      
      this.worker.onmessage = ({ data }) => {
        if (data === 'START') {
          this.backgroundBorderChunks = [];
        } else if (data === 'END') {
          this.borderChunks = this.backgroundBorderChunks;
        } else if (data.triangleCount > 0) {
          this.backgroundBorderChunks.push(new BordersChunk(gl, this.program, data.data, data.triangleCount));
        }
      };

      this.worker.postMessage({ colonies: colonies, civilizationColors: civilizationColors });

    });

    
    //this.borderChunks.push(new BordersChunk(gl, this.program, new Float32Array([-1, 0, 1,0,0,0.2,  -1, -1, 1,0,0,0.2,  0, -1, 1,0,0,0.2,  0, 0, 1,0,0,0.2,  -1, 0, 1,0,0,0.2,  0, -1, 1,0,0,0.2]), 6));
  }

  render(context: RenderContext): void {
    const camera = context.camera;
    const aspect = context.aspectRatio;
    const gl = context.gl;
    const gl2 = <any>gl;
    const zoom = camera.zoom;

    gl.enable(gl.BLEND);
    gl.blendFunc(gl.SRC_ALPHA, gl.ONE_MINUS_SRC_ALPHA);
    gl.useProgram(this.program);

    gl.uniform1f(this.zoomUniformLocation, zoom);
    gl.uniform1f(this.aspectUniformLocation, aspect);

    gl.uniform2f(this.positionUniformLocation, -camera.x, -camera.y);

    this.borderChunks.forEach(bc => {
      gl2.bindVertexArray(bc.vao);
      gl.drawArrays(gl.TRIANGLES, 0, bc.triangleCount*3);
    });
    

  }
}

class BordersChunk {
  vao: WebGLVertexArrayObjectOES;

  constructor(gl: WebGLRenderingContext, program: WebGLShader, vertices: Float32Array, public triangleCount: number) {
    this.vao = (gl as any).createVertexArray();
    (gl as any).bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(program, 'position');
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 6*4, 0);
    gl.enableVertexAttribArray(coord);

    const color = gl.getAttribLocation(program, 'v_color');
    gl.vertexAttribPointer(color, 4, gl.FLOAT, false, 6*4, 2*4);
    gl.enableVertexAttribArray(color);
  }
}