import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem } from '../../model/star-system';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, SocketStatus, ChannelConnection } from '@piros/api';
import { GalaxyDetailDto } from '../../dto/galaxy-detail';
import { Planet } from '../../model/planet';
import { map, first } from 'rxjs/operators';
import { FAKE_GALAXY_DATA } from './fake_civ_data';
import { Fleet } from '../../model/fleet';
import { TimeService } from '../time.service';
import { CivilizationDetailDto } from '../../dto/civilization-detail';
import { Civilization } from '../../model/civilization';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  private planetsSubject: BehaviorSubject<Planet[]> = new BehaviorSubject([]);

  private fleetsSubject: BehaviorSubject<Fleet[]> = new BehaviorSubject([]);

  private civilizationSubject: BehaviorSubject<Civilization> = new BehaviorSubject(undefined);



  constructor(private api: ApiService, private timeService: TimeService) {
    this.api.isReady()
    .subscribe(ready => {
      if (ready) {
        this.api.request<GalaxyDetailDto>('get-galaxy', 'test-galaxy')
          //.pipe(
            //map(g => ({...FAKE_GALAXY_DATA, starSystems: g.starSystems.concat(FAKE_GALAXY_DATA.starSystems)}))
          //)
          .subscribe(galaxy => {

            const starSystems: StarSystem[] = galaxy.starSystems.map(
              ss => new StarSystem(ss.id, ss.x, ss.y, ss.size, ss.type)
            );
            this.setStarSystems(starSystems);

            this.setCivilization(galaxy.civilization);
            

          });
      }
    });
  }

  private setCivilization(civilization: CivilizationDetailDto) {
    if (civilization) {

      //Add planets
      if (civilization.exploredStarSystems.length > 0) {
        const planets: Planet[] = civilization.exploredStarSystems.map(
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
      //end add planets
      
      //add fleets
      const fleets: Fleet[] = civilization.fleets.map(
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

      this.civilizationSubject.next(new Civilization(civilization.id, civilization.name, <Planet>this.getEntity(civilization.homeworldId)));
      
    } else {
      this.civilizationSubject.next(undefined);

      const createCivilizationChannel: ChannelConnection<CivilizationDetailDto> = this.api.connectToChannel<CivilizationDetailDto>('create-civilization');
      createCivilizationChannel.observable.subscribe(civilization => {
        this.setCivilization(civilization);
        createCivilizationChannel.disconnect();
      });
    }
  }

  public setStarSystems(starSystems: StarSystem[]): void {
    this.starSystemsSubject.value.forEach(ss => this.entityMap.delete(ss.id));
    starSystems.forEach(ss => this.entityMap.set(ss.id, ss));
    this.starSystemsSubject.next(starSystems);
  }

  public addPlanets(planets: Planet[]): void {
    planets.forEach(p => this.entityMap.set(p.id, p));
    const newPlanets = this.planetsSubject.value.concat(planets);
    this.planetsSubject.next(newPlanets);
  }

  public addFleets(fleets: Fleet[]): void {
    fleets.forEach(f => this.entityMap.set(f.id, f));
    const newFleets = this.fleetsSubject.value.concat(fleets);
    this.fleetsSubject.next(newFleets);
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

  public getCivilization(): Observable<Civilization> {
    return this.civilizationSubject.asObservable();
  }

  public getEntity(id: string): Entity {
    return this.entityMap.get(id);
  }
}
