import { Injectable, Inject } from '@angular/core';
import { StarRendererService } from './star-renderer.service';
import { RenderContext, Entity } from './renderer.interface';
import { ReplaySubject } from 'rxjs';
import { HoverService } from '../hover.service';
import { StarSystem } from 'src/app/model/star-system.interface';
import { HoverRendererService } from './hover-renderer.service';
import { Store } from '../data/store';

@Injectable({
  providedIn: 'root'
})
export class MainRendererService {

  private selectedId: string;

  private viewportSubject: ReplaySubject<{w: number, h: number}> = new ReplaySubject(1);

  private starSystems: StarSystem[] = [];

  constructor(
    @Inject('Window') private window: Window,
    private starRenderer: StarRendererService,
    private hoverRenderer: HoverRendererService,
    private hoverService: HoverService,
    private store: Store
  ) {
    this.store.getStarSystems().subscribe(ss => this.starSystems = ss);
  }

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
    this.hoverRenderer.setup(context);
    
  }

  private render(context: RenderContext): void {
    const gl = context.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    this.starRenderer.prepare(context);
    this.starRenderer.render(this.starSystems, context);

    const hovers = [];
    if (this.hoverService.hovered) {
      hovers.push(this.hoverService.hovered);
    }
    if (this.selected) {
      hovers.push(this.selected);
    }
    this.hoverRenderer.prepare(context);
    this.hoverRenderer.render(hovers, context);
  }

  setViewport(w: number, h: number) {
    this.viewportSubject.next({w: w, h: h});
  }

  setSelectedId(id: string) {
    this.selectedId = id;
  }

  get selected(): Entity {
    return this.store.getEntity(this.selectedId);
  }
}
