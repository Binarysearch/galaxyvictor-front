import { Injectable } from '@angular/core';
import { PlanetInfoDto } from 'src/app/dto/planet-info';
import { Store } from './store';
import { Planet } from 'src/app/model/planet';

@Injectable({
  providedIn: 'root'
})
export class PlanetManagerService {

  constructor(
    private store: Store
  ) { }

  public addPlanets(planetDtos: PlanetInfoDto[]): void {
    const planets: Planet[] = planetDtos.map(p => {
      const starSystem = this.store.getStarSystemById(p.starSystem);
      const planet = new Planet(
        p.id,
        this.store.getPlanetTypeById(p.type),
        this.store.getPlanetSizeById(p.size),
        p.orbit,
        starSystem
      );
      starSystem.planets.add(planet);
      return planet;
    });
    this.store.addPlanets(planets);
  }

}
