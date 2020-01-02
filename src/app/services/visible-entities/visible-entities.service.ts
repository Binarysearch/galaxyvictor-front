import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisiblePlanet, VisiblePlanetsService } from './visible-planets.service';
import { Planet } from '../../model/planet';
import { RenderContext } from '../render/renderer.interface';
import { StarSystem } from '../../model/star-system';
import { VisibleStarsService, VisibleStar } from './visible-stars.service';

@Injectable({
  providedIn: 'root'
})
export class VisibleEntitiesService {

  private started: boolean;

  constructor(
    private visiblePlanetsService: VisiblePlanetsService,
    private visibleStarsService: VisibleStarsService
  ) {
    
  }

  public setup(context: RenderContext): void {
    this.visiblePlanetsService.setup(context);
    this.visibleStarsService.setup(context);
    if (!this.started) {
      setInterval(() => {
        this.recalculate();
      }, 10);
      this.started = true;
    }
  }

  public setViewport(vp: { w: number; h: number; }) {
    this.visiblePlanetsService.setViewport(vp);
    this.visibleStarsService.setViewport(vp);
  }

  private recalculate() {
    this.visiblePlanetsService.recalculate();
    this.visibleStarsService.recalculate();
  }

  public getVisiblePlanets(): Observable<Set<VisiblePlanet>> {
    return this.visiblePlanetsService.getVisiblePlanets();
  }

  public getViewportPlanets(): Observable<Set<Planet>> {
    return this.visiblePlanetsService.getViewportPlanets();
  }

  public getVisibleStars(): Observable<VisibleStar[]> {
    return this.visibleStarsService.getVisibleStars();
  }

  public getViewportStars(): Observable<StarSystem[]> {
    return this.visibleStarsService.getViewportStars();
  }
  
}
