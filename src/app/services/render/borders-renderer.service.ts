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
  colonyCountUniformLocation: WebGLUniformLocation;
  timeUniformLocation: WebGLUniformLocation;

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
    this.colonyCountUniformLocation = gl.getUniformLocation(this.program, 'colonyCount');
    this.timeUniformLocation = gl.getUniformLocation(this.program, 'time');


    this.store.getColonies().subscribe(colonies => {
      

      const civilizationColors: Map<string, {r: number; g: number; b: number; }> = new Map();
      colonies.forEach(c => civilizationColors.set(c.civilization.id, this.colorService.getCivilizationColor(c.civilization.id)));

      const c: Colony = colonies.values().next().value;
      if(c){
        this.colonies = colonies;


        this.texture = gl.createTexture();
        gl.bindTexture(gl.TEXTURE_2D, this.texture);

        const size = 100;
        const src = [];
        for (let i = 0; i < size; i++) {
          src.push(6000 * (Math.random()*2-1));
          src.push(6000 * (Math.random()*2-1));
          src.push(100);
          src.push(1);
        }

        let i=0;
        this.colonies.forEach((c) => {

          src[i++] = (c.planet.starSystem.x);
          src[i++] = (c.planet.starSystem.y);
          src[i++] = (300);
          src[i++] = (1);
        });
    
        gl.texImage2D(gl.TEXTURE_2D, 0, gl2.RGBA32F, 10, 10, 0, gl2.RGBA, gl.FLOAT, new Float32Array(src));
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
        gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
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
    gl.uniform1i(this.colonyCountUniformLocation, this.colonies.size);

    const time = ((new Date().getTime()/10) % (Math.PI * 2000)) * 0.1;

    gl.uniform1f(this.timeUniformLocation, time);

    //////////////////
    gl.bindTexture(gl.TEXTURE_2D, this.texture);

    ///////////////////////////////////

    gl2.bindVertexArray(this.vao);
    gl.drawArrays(gl.TRIANGLES, 0, 6);
    

  }
}