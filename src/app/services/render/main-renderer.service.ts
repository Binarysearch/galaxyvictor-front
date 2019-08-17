import { Injectable, Inject } from '@angular/core';
import { StarRendererService } from './star-renderer.service';
import { RenderContext } from './renderer.interface';
import { ReplaySubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class MainRendererService {

  private viewportSubject: ReplaySubject<{w: number, h: number}> = new ReplaySubject(1);

  constructor(
    @Inject('Window') private window: Window,
    private starRenderer: StarRendererService
  ) { }

  public init(context: RenderContext): void {
    
    this.viewportSubject.subscribe(vp => {
      context.gl.viewport(0, 0, vp.w, vp.h);
      context.aspectRatio = vp.w / vp.h;
    });

    this.setup(context);
    const animate = () => {
      this.window.requestAnimationFrame(animate);
      context.camera.update();
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

  setViewport(w: number, h: number) {
    this.viewportSubject.next({w: w, h: h});
  }

}
