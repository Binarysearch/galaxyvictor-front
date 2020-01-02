import { Injectable } from '@angular/core';
import { Store } from '../data/store';
import { Planet } from '../../model/planet';
import { MIN_ZOOM_TO_VIEW_PLANET_NAMES } from '../../galaxy-constants';
import { Camera } from '../render/camera';
import { BehaviorSubject, Observable } from 'rxjs';
import { PlanetRendererService } from '../render/planet-renderer.service';
import { CameraChangeRecorder } from './camera-change-recorder';
import { RenderContext } from '../render/renderer.interface';

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
  private cameraChanges: CameraChangeRecorder;

  private planets: Set<Planet> = new Set();
  private viewportPlanets: BehaviorSubject<Set<Planet>> = new BehaviorSubject(new Set());
  private visiblePlanets: BehaviorSubject<Set<VisiblePlanet>> = new BehaviorSubject(new Set());
  private planetsChanged: boolean;

  constructor(
    private store: Store,
    private planetRenderer: PlanetRendererService
  ) {

    this.store.getPlanets().subscribe(planets => {
      this.planets = planets;
      this.planetsChanged = true;
    });
    
  }

  public setup(context: RenderContext): void {
    this.camera = context.camera;
    this.cameraChanges = new CameraChangeRecorder(this.camera);
  }

  public setViewport(viewport: { w: number; h: number; }) {
    this.viewport = viewport;
    this.aspectRatio = viewport.w / viewport.h;
  }

  public recalculate(): void {
    if (this.cameraChanges.changed() || this.planetsChanged) {
      const viewportPlanets: Set<Planet> = new Set();
      
      this.planets.forEach(p => {
        if (this.isVisible(p)) {
          viewportPlanets.add(p);
        }
      });
      
      this.viewportPlanets.next(viewportPlanets);
      this.planetsChanged = false;
    }

    if(this.camera.zoom < MIN_ZOOM_TO_VIEW_PLANET_NAMES){
      this.visiblePlanets.next(new Set());
    } else {
      const visiblePlanets: Set<VisiblePlanet> = new Set();

      this.viewportPlanets.value.forEach(p => {
        visiblePlanets.add({ x: this.getX(p), y: this.getY(p), planet: p });
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
    const camera = this.camera;
    return ((p.x - camera.x) * camera.zoom / this.aspectRatio + 1) * this.viewport.w / 2;
  }

  private getY(p: Planet): number {    
    const camera = this.camera;
    return (1 - (p.y - camera.y - this.planetRenderer.getRenderScale(p, camera.zoom)*3) * camera.zoom) * this.viewport.h / 2;
  }

  public getVisiblePlanets(): Observable<Set<VisiblePlanet>> {
    return this.visiblePlanets.asObservable();
  }

  public getViewportPlanets(): Observable<Set<Planet>> {
    return this.viewportPlanets.asObservable();
  }

}
