import { Injectable } from '@angular/core';
import { Renderer, RenderContext } from './renderer.interface';
import { ShaderCompilerService } from '../gl-utils/shader-compiler.service';
import { BORDERS_VS_SOURCE, BORDERS_FS_SOURCE } from './shaders/borders-shader';
import { ColorService } from '../color.service';
import { BorderRect } from '../borders.service';
import { Store } from '../data/store';
import { Colony } from 'src/app/model/colony';

@Injectable({
  providedIn: 'root'
})
export class BordersRendererService {

  program: WebGLShader;
  aspectUniformLocation: WebGLUniformLocation;
  zoomUniformLocation: WebGLUniformLocation;
  positionUniformLocation: WebGLUniformLocation;
  vao: WebGLVertexArrayObjectOES;

  private worker: Worker;
  texture: WebGLTexture;
  colonies: Set<Colony>;

  constructor(
    private shaderCompiler: ShaderCompilerService,
    private colorService: ColorService,
    private store: Store
  ) { }

  setup(context: RenderContext): void {
    const gl = context.gl;
    const gl2 = <WebGL2RenderingContext>context.gl;
    this.program = this.shaderCompiler.createShaderProgram(gl, BORDERS_VS_SOURCE, BORDERS_FS_SOURCE);

    this.aspectUniformLocation = gl.getUniformLocation(this.program, 'aspect');
    this.zoomUniformLocation = gl.getUniformLocation(this.program, 'zoom');
    this.positionUniformLocation = gl.getUniformLocation(this.program, 'pos');


    this.store.getColonies().subscribe(colonies => {
      

      const civilizationColors: Map<string, {r: number; g: number; b: number; }> = new Map();
      colonies.forEach(c => civilizationColors.set(c.civilization.id, this.colorService.getCivilizationColor(c.civilization.id)));

      const c: Colony = colonies.values().next().value;
      if(c){
        this.colonies = colonies;

        const f = 256*256*256*255;
        const cx = 60000;
        const x = f*(1 + cx / 60000) / 2;
        const x1 = x / (256.0 * 256.0 * 256.0);
        const x2 = x / (256.0 * 256.0) % 256;
        const x3 = x / (256.0) % 256;
        const x4 = x % 256;

        const arr = new Uint8Array([x1, x2, x3, x4]);
        console.log([x1, x2, x3, x4]);
        console.log(arr);

        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);
        gl.texImage2D(gl.TEXTURE_2D, 0, gl2.RGBA, 1, 1, 0, gl2.RGBA, gl2.UNSIGNED_BYTE, arr);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
      }

    });

    this.vao = (gl as any).createVertexArray();
    (gl as any).bindVertexArray(this.vao);

    gl.bindBuffer(gl.ARRAY_BUFFER, gl.createBuffer());
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-60000, 60000,  -60000, -60000,  60000, -60000,  60000, 60000,  -60000, 60000,  60000, -60000]), gl.STATIC_DRAW);

    const coord = gl.getAttribLocation(this.program, 'position');
    gl.vertexAttribPointer(coord, 2, gl.FLOAT, false, 0, 0);
    gl.enableVertexAttribArray(coord);


    ///////////////////////////////
    
    
    ////////////////////////////
    
  }

  render(context: RenderContext): void {
    if(!this.colonies || this.colonies.size === 0){
      return;
    }
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
    gl.uniform2f(this.positionUniformLocation, -60000, 0);

    //////////////////
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    ///////////////////////////////////

    gl2.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    

  }
}