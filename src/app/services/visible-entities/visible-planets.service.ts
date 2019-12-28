import { Injectable } from '@angular/core';
import { Store } from '../data/store';
import { GalaxyMapService } from '../galaxy-map.service';
import { MainRendererService } from '../render/main-renderer.service';
import { Planet } from '../../model/planet';
import { MIN_ZOOM_TO_VIEW_NAMES } from '../../galaxy-constants';
import { Camera } from '../render/camera';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanetRendererService } from '../render/planet-renderer.service';

export interface VisiblePlanet {
  x: number;
  y: number;
  planet: Planet;
}

@Injectable({
  providedIn: 'root'
})
export class VisiblePlanetsService {
  
  private viewport: { w: number; h: number; };
  private aspectRatio: number;
  private camera: Camera;

  private planets: Planet[] = [];
  private viewportPlanets: Planet[] = [];
  private visiblePlanets: BehaviorSubject<VisiblePlanet[]> = new BehaviorSubject([]);
  planetsChanged: boolean;
  oldCameraCoords: { x: number; y: number; zoom: number; };

  constructor(
    private store: Store,
    private map: GalaxyMapService,
    private renderer: MainRendererService,
    private planetRenderer: PlanetRendererService
  ) {

    this.renderer.getViewport().subscribe(viewport => {
      this.viewport = viewport;
      this.aspectRatio = viewport.w / viewport.h;
    });

    this.store.getPlanets().subscribe(planets => {
      this.planets = planets;
      this.planetsChanged = true;
    });

    this.camera = this.map.getContext().camera;
    this.oldCameraCoords = {
      x: this.camera.x,
      y: this.camera.y,
      zoom: this.camera.zoom
    }
  }

  public recalculate(): void {
    if(this.camera.zoom < MIN_ZOOM_TO_VIEW_NAMES){
      this.visiblePlanets.next([]);
    } else {

      if (this.cameraHasChanged() || this.planetsChanged) {
        this.viewportPlanets = this.planets.filter(p => {
          return this.isVisible(p);
        });
        this.planetsChanged = false;
      }

      const visiblePlanets = this.viewportPlanets.map(p => {
        return ({ x: this.getX(p), y: this.getY(p), planet: p });
      });

      this.visiblePlanets.next(visiblePlanets);
    }
  }

  private isVisible(p: Planet): boolean {
    const camera = this.camera;
    const x = (p.x - camera.x) * camera.zoom / this.aspectRatio;
    const y = (p.y - camera.y) * camera.zoom;
    return x > -2 && x < 2 && y > -2 && y < 2;
  }

  private getX(p: Planet): number {
    const context = this.map.getContext();
    
    const camera = context.camera;
    return ((p.x - camera.x) * camera.zoom / context.aspectRatio + 1) * this.viewport.w / 2;
  }

  private getY(p: Planet): number {
    const context = this.map.getContext();
    
    const camera = context.camera;
    return (1 - (p.y - camera.y - this.planetRenderer.getRenderScale(p, camera.zoom)*3) * camera.zoom) * this.viewport.h / 2;
  }

  private cameraHasChanged(): boolean {
    const changeX = Math.abs(this.oldCameraCoords.x - this.camera.x) * this.camera.zoom;
    const changeY = Math.abs(this.oldCameraCoords.y - this.camera.y) * this.camera.zoom;
    const changeZ = this.oldCameraCoords.zoom / this.camera.zoom;
    const result = changeX > 1 || changeY > 1 || changeZ > 1.5 || changeZ < 0.75;

    if (result) {
      this.oldCameraCoords = {
        x: this.camera.x,
        y: this.camera.y,
        zoom: this.camera.zoom
      }
    }
    return result;
  }

  public getVisiblePlanets(): Observable<VisiblePlanet[]> {
    return this.visiblePlanets.asObservable();
  }
}
