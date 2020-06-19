import { Injectable } from '@angular/core';
import { StarsService } from './stars.service';
import { Entity } from '../render/renderer.interface';
import { PlanetsService } from './planets.service';

@Injectable({
  providedIn: 'root'
})
export class MapEntitiesService {

  private entities: Map<string, Entity> = new Map();

  constructor(
    private starService: StarsService,
    private planetsService: PlanetsService
  ) {
    this.starService.getStars().subscribe(
      stars => stars.forEach(s => this.entities.set(s.id, s))
    );
    this.planetsService.getPlanets().subscribe(
      planets => planets.forEach(s => this.entities.set(s.id, s))
    );
  }

  public getEntity(id: string): Entity {
    return this.entities.get(id);
  }

}
