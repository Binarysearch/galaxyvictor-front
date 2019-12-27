import { Component, OnInit, OnDestroy } from '@angular/core';
import { Store } from '../../services/data/store';
import { takeUntil } from 'rxjs/operators';
import { Subject } from 'rxjs';
import { Planet } from '../../model/planet';
import { GalaxyMapService } from 'src/app/services/galaxy-map.service';
import { MainRendererService } from 'src/app/services/render/main-renderer.service';
import { MIN_ZOOM_TO_VIEW_NAMES, PLANET_RENDER_SCALE_ZI, PLANET_RENDER_SCALE_ZD, PLANET_RENDER_SCALE_ZI_SI } from '../../galaxy-constants';

@Component({
  selector: 'app-text-renderer',
  templateUrl: './text-renderer.component.html',
  styleUrls: ['./text-renderer.component.css']
})
export class TextRendererComponent implements OnInit, OnDestroy {

  private destroyed: Subject<void> = new Subject();
  planets: Planet[] = [];
  viewport: { w: number; h: number; };
  interval: NodeJS.Timer;
  procesedPlanets: { x: number; y: number; name: string }[];

  constructor(
    private store: Store,
    private map: GalaxyMapService,
    private renderer: MainRendererService
  ) { }

  ngOnInit() {
    this.renderer.getViewport().pipe(takeUntil(this.destroyed)).subscribe(viewport => this.viewport = viewport);
    this.store.getPlanets().pipe(takeUntil(this.destroyed)).subscribe(planets => this.planets = planets);
    this.interval = setInterval(() => {
      if(this.map.getContext().camera.zoom < MIN_ZOOM_TO_VIEW_NAMES){
        this.procesedPlanets = [];
        return;
      }
      this.procesedPlanets = this.planets.filter(p => {
        return this.isVisible(p);
      }).map(p => {
        return ({ x: this.getX(p), y: this.getY(p), name: p.name });
      });
    }, 30);
  }

  ngOnDestroy() {
    clearInterval(this.interval);
    this.destroyed.next();
    this.destroyed.complete();
  }

  getX(p: Planet): number {
    const context = this.map.getContext();
    
    const camera = context.camera;
    return ((p.x - camera.x) * camera.zoom / context.aspectRatio + 1) * this.viewport.w / 2;
  }

  getY(p: Planet): number {
    const context = this.map.getContext();
    
    const camera = context.camera;
    return (1 - (p.y - camera.y - this.getRenderScale(p, camera.zoom)*2) * camera.zoom) * this.viewport.h / 2;
  }

  isVisible(p: Planet): boolean {
    const context = this.map.getContext();
    
    const camera = context.camera;
    const x = (p.x - camera.x) * camera.zoom / context.aspectRatio;
    const y = (p.y - camera.y) * camera.zoom;
    return x > -1 && x < 1 && y > -1 && y < 1;
  }

  getRenderScale(planet: Planet, zoom: number): number {
    const scale = (PLANET_RENDER_SCALE_ZI * planet.size * planet.size + PLANET_RENDER_SCALE_ZI_SI)
      / zoom + (PLANET_RENDER_SCALE_ZD * planet.size * planet.size);
    return scale;
  }
}
