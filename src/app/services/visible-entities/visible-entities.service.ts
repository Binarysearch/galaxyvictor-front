import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisiblePlanet, VisiblePlanetsService } from './visible-planets.service';
import { Planet } from '../../model/planet';
import { RenderContext } from '../render/renderer.interface';

@Injectable({
  providedIn: 'root'
})
export class VisibleEntitiesService {
  private started: boolean;

  constructor(
    private visiblePlanetsService: VisiblePlanetsService
  ) {
    
  }

  public setup(context: RenderContext): void {
    this.visiblePlanetsService.setup(context);
    if (!this.started) {
      setInterval(() => {
        this.recalculate();
      }, 10);
      this.started = true;
    }
  }

  public setViewport(vp: { w: number; h: number; }) {
    this.visiblePlanetsService.setViewport(vp);
  }
  
  private recalculate() {
    this.visiblePlanetsService.recalculate();
  }

  public getVisiblePlanets(): Observable<VisiblePlanet[]> {
    return this.visiblePlanetsService.getVisiblePlanets();
  }

  public getViewportPlanets(): Observable<Planet[]> {
    return this.visiblePlanetsService.getViewportPlanets();
  }
  
}
