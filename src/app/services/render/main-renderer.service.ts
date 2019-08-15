import { Injectable } from '@angular/core';
import { StarRendererService } from './star-renderer.service';
import { RenderContext } from './renderer.interface';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainRendererService {

  private viewportSubject: ReplaySubject<{w: number, h: number}> = new ReplaySubject(1);

  setViewport(w: number, h: number) {
    this.viewportSubject.next({w: w, h: h});
  }

  constructor(
    private starRenderer: StarRendererService
  ) { }

  public init(gl: WebGLRenderingContext): void {
    const context: RenderContext = {
      gl: gl,
      aspectRatio: 1.333,
      camera: {
        zoom: 1,
        x: 0,
        y: 0
      }
    };

    this.viewportSubject.subscribe(vp => {
      context.gl.viewport(0, 0, vp.w, vp.h);
      context.aspectRatio = vp.w / vp.h;
    });

    this.setup(context);
    const animate = () => {
        window.requestAnimationFrame(animate);
        this.render(context);
    };
    animate();
  }

  private setup(context: RenderContext): void {
    context.gl.clearColor(0, 0, 0, 1);
    this.starRenderer.setup(context);
    
  }

  private render(context: RenderContext): void {
    const gl = context.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.starRenderer.prepare(context);
    this.starRenderer.render([
      { 
        x: 0,
        y: 0,
        type: 1,
        size: 5
      }
    ], context);

  }
  
}
