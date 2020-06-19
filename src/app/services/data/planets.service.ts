import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Planet, PlanetType, PlanetSize } from 'src/app/model/planet';
import { GvApiService } from '../gv-api.service';
import { Status } from 'src/app/model/gv-api-service-status';
import { EventService } from '../event.service';
import { PlanetInfoDto } from 'src/app/dto/planet-info';
import { PLANET_TYPES, PLANET_SIZES } from 'src/app/galaxy-constants';
import { StarsService } from './stars.service';

@Injectable({
  providedIn: 'root'
})
export class PlanetsService {

  private planetMap: Map<string, Planet> = new Map();

  private planets: BehaviorSubject<Set<Planet>> = new BehaviorSubject(new Set());

  private unknownPlanet: Planet = new Planet('', PLANET_TYPES[0], PLANET_SIZES[0], 0, StarsService.unknownStarSystem);

  constructor(
    private eventService: EventService,
    private starsService: StarsService,
    private api: GvApiService
  ) {
    this.api.getStatus().subscribe(status => {
      if (status.sessionStarted === Status.SESSION_STARTED) {
        if (status.stars) {
          this.api.getCivilization().subscribe(civilization => {
            if (civilization) {
              this.api.getPlanets().subscribe(
                planets => {
                  this.addPlanets(planets.map(p => this.mapPlanetInfoToPlanet(p)));
                }
              );
            }
          });
        }
      }
    });

    this.eventService.getExploreStarSystemEvents().subscribe(
      event => {
        if (event.planets && event.planets.length > 0) {
          this.addPlanets(event.planets.map(p => this.mapPlanetInfoToPlanet(p)));
        }
      }
    );
  }

  public getPlanets(): Observable<Set<Planet>> {
    return this.planets.asObservable();
  }

  public getPlanetById(id: string): Planet {
    if (this.planetMap.has(id)) {
      return <Planet>this.planetMap.get(id);
    } else {
      return this.unknownPlanet;
    }
  }
  
  private addPlanets(planets: Planet[]): void {
    planets.forEach(p => {
      this.planetMap.set(p.id, p);
      this.planets.value.add(p);
    });
    this.planets.next(this.planets.value);
  }
  
  private mapPlanetInfoToPlanet(p: PlanetInfoDto) {
    const starSystem = this.starsService.getStarById(p.starSystem);
    const planet = new Planet(p.id, this.getPlanetTypeById(p.type), this.getPlanetSizeById(p.size), p.orbit, starSystem);
    starSystem.planets.add(planet);
    return planet;
  }
  
  public getPlanetTypeById(type: number): PlanetType {
    return PLANET_TYPES[type - 1];
  }
  
  public getPlanetSizeById(size: number): PlanetSize {
    return PLANET_SIZES[size - 1];
  }
  
}