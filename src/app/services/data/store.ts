import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem } from '../../model/star-system';
import { BehaviorSubject, Observable } from 'rxjs';
import { ApiService, ChannelConnection } from '@piros/api';
import { GalaxyDetailDto } from '../../dto/galaxy-detail';
import { Planet } from '../../model/planet';
import { Fleet } from '../../model/fleet';
import { TimeService } from '../time.service';
import { CivilizationDetailDto } from '../../dto/civilization-detail';
import { Civilization } from '../../model/civilization';
import { Colony } from 'src/app/model/colony';
import { FleetUpdatesService } from '../updates/fleet-updates.service';
import { PlanetUpdatesService } from '../updates/planet-updates.service';
import { FleetInfoDto } from 'src/app/dto/fleet-info';
import { PlanetInfoDto } from 'src/app/dto/planet-info';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  private planetsSubject: BehaviorSubject<Planet[]> = new BehaviorSubject([]);

  private coloniesSubject: BehaviorSubject<Colony[]> = new BehaviorSubject([]);

  private fleetsSubject: BehaviorSubject<Fleet[]> = new BehaviorSubject([]);

  private civilizationSubject: BehaviorSubject<Civilization> = new BehaviorSubject(undefined);
  
  private unknownCivilization: Civilization = new Civilization('', 'Desconocida');
  private unknownStarSystem: StarSystem = new StarSystem('', 'Desconocido', 0, 0, 1, 1);
  private unknownPlanet: Planet = new Planet('', 1, 0, 0, this.unknownStarSystem);



  constructor(
    private api: ApiService,
    private timeService: TimeService,
    private fleetUpdatesService: FleetUpdatesService,
    private planetUpdatesService: PlanetUpdatesService
  ) {
    this.api.isReady()
    .subscribe(ready => {
      if (ready) {
        this.api.request<GalaxyDetailDto>('get-galaxy', 'test-galaxy')
          //.pipe(
            //map(g => ({...FAKE_GALAXY_DATA, starSystems: g.starSystems.concat(FAKE_GALAXY_DATA.starSystems)}))
          //)
          .subscribe(galaxy => {

            const starSystems: StarSystem[] = galaxy.starSystems.map(
              ss => new StarSystem(ss.id, ss.name, ss.x, ss.y, ss.size, ss.type)
            );
            this.setStarSystems(starSystems);

            this.setCivilization(galaxy.civilization);
            

          });
        
          this.subscribeToFleetUpdates();
          this.subscribeToPlanetUpdates();
      }
    });
  }

  private subscribeToFleetUpdates() {
    this.fleetUpdatesService.getFleetUpdates().subscribe(f => {
      const fleet = this.createFleet(f);
      this.removeFleet(fleet);
      this.addFleets([fleet]);
    });
  }

  private subscribeToPlanetUpdates() {
    this.planetUpdatesService.getPlanetUpdates().subscribe(p => {
      const planet = this.createPlanet(p);
      this.removePlanet(planet);
      this.addPlanets([planet]);
    });
  }

  private setCivilization(civilizationDto: CivilizationDetailDto) {
    if (civilizationDto) {
      const civilization = new Civilization(civilizationDto.id, civilizationDto.name);
      
      this.entityMap.set(civilization.id, civilization);
      
      //Add planets
      if (civilizationDto.exploredStarSystems.length > 0) {
        const planets: Planet[] = [];
        civilizationDto.exploredStarSystems.forEach(
          ss => ss.planets.forEach(
            p => {
              const planet: Planet = this.createPlanet(p);
              planets.push(planet);
            }
          )
        );

        this.addPlanets(planets);
      }
      //end add planets

      if (civilizationDto.colonies) {
        const colonies: Colony[] = [];
        
        civilizationDto.colonies.forEach(c => {
          const planet = <Planet>this.entityMap.get(c.planet);
          const colony = new Colony(
            c.id,
            planet, 
            this.getCivilizationById(c.civilizationId)
          );
          planet.colony = colony;
          colonies.push(colony);
        });

        this.addColonies(colonies);
      }
      
      civilization.homeworld = <Planet>this.getEntity(civilizationDto.homeworldId);

      //add fleets
      const fleets: Fleet[] = civilizationDto.fleets.map(
        f => this.createFleet(f)
      );
      
      this.addFleets(fleets);
      //end add fleets

      this.civilizationSubject.next(civilization);
      
    } else {
      this.civilizationSubject.next(undefined);

      const createCivilizationChannel: ChannelConnection<CivilizationDetailDto> = this.api.connectToChannel<CivilizationDetailDto>('create-civilization');
      createCivilizationChannel.observable.subscribe(civilization => {
        this.setCivilization(civilization);
        createCivilizationChannel.disconnect();
      });
    }
  }

  private createFleet(f: FleetInfoDto): Fleet {
    return new Fleet(
      f.id,
      f.seed,
      f.speed,
      f.startTravelTime,
      <StarSystem>this.getEntity(f.destinationId),
      <StarSystem>this.getEntity(f.originId),
      this.getCivilizationById(f.civilizationId),
      this.timeService
    );
  }

  private createPlanet(p: PlanetInfoDto): Planet {
    return new Planet(
      p.id,
      p.type,
      p.size,
      p.orbit,
      <StarSystem>this.getEntity(p.starSystem)
    );
  }

  public getStarSystemById(id: string): StarSystem {
    if (this.entityMap.has(id)) {
      return <StarSystem>this.entityMap.get(id);
    } else {
      return this.unknownStarSystem;
    }
  }

  public getPlanetById(id: string): Planet {
    if (this.entityMap.has(id)) {
      return <Planet>this.entityMap.get(id);
    } else {
      return this.unknownPlanet;
    }
  }

  public getCivilizationById(id: string): Civilization {
    if (this.entityMap.has(id)) {
      return <Civilization>this.entityMap.get(id);
    } else {
      return this.unknownCivilization;
    }
  }

  addColonies(colonies: Colony[]) {
    colonies.forEach(c => this.entityMap.set(c.id, c));
    const newColonies = this.coloniesSubject.value.concat(colonies);
    this.coloniesSubject.next(newColonies);
  }

  public removeColony(colony: Colony): void {
    this.entityMap.delete(colony.id);
    const newColonies = this.coloniesSubject.value.filter(c => c.id !== colony.id);
    this.coloniesSubject.next(newColonies);
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

  public removePlanet(planet: Planet): void {
    this.entityMap.delete(planet.id);
    const newPlanets = this.planetsSubject.value.filter(p => p.id !== planet.id);
    this.planetsSubject.next(newPlanets);
  }

  public addFleets(fleets: Fleet[]): void {
    fleets.forEach(f => this.entityMap.set(f.id, f));
    const newFleets = this.fleetsSubject.value.concat(fleets);
    this.fleetsSubject.next(newFleets);
  }

  public removeFleet(fleet: Fleet): void {
    this.entityMap.delete(fleet.id);
    const newFleets = this.fleetsSubject.value.filter(f => f.id !== fleet.id);
    this.fleetsSubject.next(newFleets);
  }

  public getPlanets(): Observable<Planet[]> {
    return this.planetsSubject.asObservable();
  }

  public getColonies(): Observable<Colony[]> {
    return this.coloniesSubject.asObservable();
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

  public clear(): void {
    this.starSystemsSubject.next([]);
    this.planetsSubject.next([]);
    this.fleetsSubject.next([]);
    this.coloniesSubject.next([]);
    this.civilizationSubject.next(undefined);
    this.entityMap.clear();
  }
}
