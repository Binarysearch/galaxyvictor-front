import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { VisiblePlanet, VisiblePlanetsService } from './visible-planets.service';

@Injectable({
  providedIn: 'root'
})
export class VisibleEntitiesService {
  recalculate() {
    this.visiblePlanetsService.recalculate();
  }

  constructor(
    private visiblePlanetsService: VisiblePlanetsService
  ) {
    setInterval(() => {
      this.recalculate();
    }, 10);
  }

  public getVisiblePlanets(): Observable<VisiblePlanet[]> {
    return this.visiblePlanetsService.getVisiblePlanets();
  }
  
}
