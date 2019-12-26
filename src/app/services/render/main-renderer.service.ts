import { Injectable, Inject } from '@angular/core';
import { StarRendererService } from './star-renderer.service';
import { RenderContext, Entity, Segment } from './renderer.interface';
import { ReplaySubject } from 'rxjs';
import { HoverService } from '../hover.service';
import { StarSystem } from 'src/app/model/star-system';
import { HoverRendererService } from './hover-renderer.service';
import { Store } from '../data/store';
import { Planet } from 'src/app/model/planet';
import { PlanetRendererService } from './planet-renderer.service';
import { FleetRendererService } from './fleet-renderer.service';
import { ColonyRendererService } from './colony-renderer.service';
import { Fleet } from 'src/app/model/fleet';
import { LineRendererService } from './line-renderer.service';
import { Colony } from 'src/app/model/colony';

@Injectable({
  providedIn: 'root'
})
export class MainRendererService {

  private selectedId: string;

  private viewportSubject: ReplaySubject<{w: number, h: number}> = new ReplaySubject(1);

  private starSystems: StarSystem[] = [];
  private planets: Planet[] = [];
  private fleets: Fleet[] = [];
  private colonies: Colony[] = [];

  constructor(
    @Inject('Window') private window: Window,
    private starRenderer: StarRendererService,
    private planetRenderer: PlanetRendererService,
    private fleetRenderer: FleetRendererService,
    private colonyRenderer: ColonyRendererService,
    private hoverRenderer: HoverRendererService,
    private travelLineRenderer: LineRendererService,
    private hoverService: HoverService,
    private store: Store
  ) {
    this.store.getStarSystems().subscribe(ss => this.starSystems = ss);
    this.store.getPlanets().subscribe(planets => this.planets = planets);
    this.store.getFleets().subscribe(fleets => this.fleets = fleets);
    this.store.getColonies().subscribe(colonies => this.colonies = colonies);
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
    this.planetRenderer.setup(context);
    this.fleetRenderer.setup(context);
    this.colonyRenderer.setup(context);
    this.hoverRenderer.setup(context);
    this.travelLineRenderer.setup(context);
    
  }

  private render(context: RenderContext): void {
    const gl = context.gl;
    gl.clear(gl.COLOR_BUFFER_BIT);

    const hovers = [];
    if (this.hoverService.hovered) {
      hovers.push(this.hoverService.hovered);
    }
    if (this.selected) {
      hovers.push(this.selected);
    }
    this.hoverRenderer.render(hovers, context);

    this.starRenderer.render(this.starSystems, context);
    this.planetRenderer.render(this.planets, context);
    this.fleetRenderer.render(this.fleets, context);
    this.colonyRenderer.render(this.colonies, context);

    this.travelLineRenderer.render(this.getTravelLines(), context);
  }

  getTravelLines(): Segment[] {
    const lines = [];
    if(this.selected instanceof Fleet){
      const f = <Fleet>this.selected;
      if (f.isTravelling) {
        lines.push({ id: '', x1: f.x, y1: f.y, x2: f.destination.x, y2: f.destination.y });
      }
      if (this.hoverService.hovered && this.hoverService.hovered instanceof StarSystem) {
        const ss = this.hoverService.hovered;
        lines.push({ id: '', x1: f.x, y1: f.y, x2: ss.x, y2: ss.y });
      }
    }
    return lines;
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
