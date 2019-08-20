import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem } from 'src/app/model/star-system.interface';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';
import { GalaxyDetail } from '../../dto/galaxy-detail';
import { Planet } from 'src/app/model/planet';
import { PlanetInfo } from 'src/app/dto/planet-info';
import { map } from 'rxjs/operators';
import { FAKE_GALAXY_DATA } from './fake_civ_data';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private starSystems: StarSystem[] = [];
  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  private planets: Planet[] = [];
  private planetsSubject: BehaviorSubject<Planet[]> = new BehaviorSubject([]);

  constructor(private api: ApiService) {
    this.api.getReady().subscribe(ready => {
      if (ready) {
        this.api.request<GalaxyDetail>('get-galaxy', 'test-galaxy')
          .pipe(
            map(g => FAKE_GALAXY_DATA)
          )
          .subscribe(galaxy => {

            this.setStarSystems(galaxy.starSystems);

            if (galaxy.civilization) {
              const planets: Planet[] = galaxy.civilization.exploredStarSystems.map(
                ss => ss.planets.map(
                  p => new Planet(
                    p.id,
                    p.type,
                    p.size,
                    p.orbit,
                    <StarSystem>this.getEntity(ss.id)
                  )
                )
              ).reduce(
                (prev, curr) => prev.concat(curr)
              );

              this.addPlanets(planets);
            }

          });
      }
    });
  }

  public setStarSystems(starSystems: StarSystem[]): void {
    this.starSystems.forEach(ss => this.entityMap.delete(ss.id));
    this.starSystems = starSystems;
    this.starSystems.forEach(ss => this.entityMap.set(ss.id, ss));
    this.starSystemsSubject.next(this.starSystems);
  }

  public addPlanets(planets: Planet[]): void {
    planets.forEach(p => this.entityMap.set(p.id, p));
    this.planets = this.planets.concat(planets);
    this.planetsSubject.next(this.planets);
  }

  public getPlanets(): Observable<Planet[]> {
    return this.planetsSubject.asObservable();
  }

  public getStarSystems(): Observable<StarSystem[]> {
    return this.starSystemsSubject.asObservable();
  }

  public getEntity(id: string): Entity {
    return this.entityMap.get(id);
  }
}
