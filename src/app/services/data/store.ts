import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem } from 'src/app/model/star-system';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, SocketStatus } from '@piros/api';
import { GalaxyDetail } from '../../dto/galaxy-detail';
import { Planet } from 'src/app/model/planet';
import { map, first } from 'rxjs/operators';
import { FAKE_GALAXY_DATA } from './fake_civ_data';
import { Fleet } from 'src/app/model/fleet';
import { TimeService } from '../time.service';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private starSystems: StarSystem[] = [];
  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  private planets: Planet[] = [];
  private planetsSubject: BehaviorSubject<Planet[]> = new BehaviorSubject([]);

  private fleets: Fleet[] = [];
  private fleetsSubject: BehaviorSubject<Fleet[]> = new BehaviorSubject([]);

  constructor(private api: ApiService, private timeService: TimeService) {
    this.api.isReady()
    .subscribe(ready => {
      if (ready) {
        this.api.request<GalaxyDetail>('get-galaxy', 'test-galaxy')
          .pipe(
            map(g => ({...FAKE_GALAXY_DATA, starSystems: g.starSystems.concat(FAKE_GALAXY_DATA.starSystems)}))
          )
          .subscribe(galaxy => {

            const starSystems: StarSystem[] = galaxy.starSystems.map(
              ss => new StarSystem(ss.id, ss.x, ss.y, ss.size, ss.type)
            );
            this.setStarSystems(starSystems);

            if (galaxy.civilization) {

              //Add planets
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
              //end add planets
              
              //add fleets
              const fleets: Fleet[] = galaxy.civilization.fleets.map(
                f => new Fleet(
                  f.id,
                  f.seed,
                  f.speed,
                  f.startTravelTime,
                  <StarSystem>this.getEntity(f.destinationId),
                  <StarSystem>this.getEntity(f.originId),
                  this.timeService
                )
              );
              
              this.addFleets(fleets);
              //end add fleets
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

  public addFleets(fleets: Fleet[]): void {
    fleets.forEach(f => this.entityMap.set(f.id, f));
    this.fleets = this.fleets.concat(fleets);
    this.fleetsSubject.next(this.fleets);
  }

  public getPlanets(): Observable<Planet[]> {
    return this.planetsSubject.asObservable();
  }

  public getFleets(): Observable<Fleet[]> {
    return this.fleetsSubject.asObservable();
  }

  public getStarSystems(): Observable<StarSystem[]> {
    return this.starSystemsSubject.asObservable();
  }

  public getEntity(id: string): Entity {
    return this.entityMap.get(id);
  }
}
