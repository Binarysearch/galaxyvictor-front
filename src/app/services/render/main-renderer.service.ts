import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class MainRendererService {

  private gl: WebGLRenderingContext;

  constructor() { }

  public setupContext(context: WebGLRenderingContext): void {
    this.gl = context;
    const gl = context;
    gl.clearColor(0, 0, 0, 1);
    
    const animate = () => {
        window.requestAnimationFrame(animate);
        
        
        gl.clear(gl.COLOR_BUFFER_BIT);
    };
    animate();
  }
  
}
