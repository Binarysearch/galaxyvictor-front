import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem, StarType, StarSize } from '../../model/star-system';
import { BehaviorSubject, Observable } from 'rxjs';
import { Planet, PlanetType, PlanetSize } from '../../model/planet';
import { Fleet } from '../../model/fleet';
import { Civilization } from '../../model/civilization';
import { Colony } from '../../model/colony';
import { STAR_TYPES, STAR_SIZES, PLANET_TYPES, PLANET_SIZES } from '../../galaxy-constants';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  private planetsSubject: BehaviorSubject<Set<Planet>> = new BehaviorSubject(new Set());

  private coloniesSubject: BehaviorSubject<Set<Colony>> = new BehaviorSubject(new Set());

  private fleetsSubject: BehaviorSubject<Set<Fleet>> = new BehaviorSubject(new Set());

  private civilizationSubject: BehaviorSubject<Civilization> = new BehaviorSubject(undefined);
  
  private unknownCivilization: Civilization = new Civilization('', 'Desconocida', false);
  private unknownStarSystem: StarSystem = new StarSystem('', 'Desconocido', 0, 0, STAR_SIZES[0], STAR_TYPES[0]);
  private unknownPlanet: Planet = new Planet('', PLANET_TYPES[0], PLANET_SIZES[0], 0, this.unknownStarSystem);



  constructor() { }
  
  public setCivilization(civilization: Civilization) {
    this.civilizationSubject.next(civilization);
  }
  
  public addCivilization(civilization: Civilization) {
    this.entityMap.set(civilization.id, civilization);
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

  public getFleetById(id: string): Fleet {
    return <Fleet>this.entityMap.get(id);
  }

  public getColonyById(id: string): Colony {
    return <Colony>this.entityMap.get(id);
  }

  public getCivilizationById(id: string): Civilization {
    if (this.entityMap.has(id)) {
      return <Civilization>this.entityMap.get(id);
    } else {
      return this.unknownCivilization;
    }
  }

  public addColonies(colonies: Colony[]) {
    colonies.forEach(c => {
      this.entityMap.set(c.id, c);
      this.coloniesSubject.value.add(c);
    });
    this.coloniesSubject.next(this.coloniesSubject.value);
  }

  public removeColony(colony: Colony): void {
    this.entityMap.delete(colony.id);
    this.coloniesSubject.value.delete(colony);
    this.coloniesSubject.next(this.coloniesSubject.value);
  }

  public setStarSystems(starSystems: StarSystem[]): void {
    this.starSystemsSubject.value.forEach(ss => this.entityMap.delete(ss.id));
    starSystems.forEach(ss => this.entityMap.set(ss.id, ss));
    this.starSystemsSubject.next(starSystems);
  }

  public addPlanets(planets: Planet[]): void {
    planets.forEach(p => {
      this.entityMap.set(p.id, p);
      this.planetsSubject.value.add(p);
    });
    this.planetsSubject.next(this.planetsSubject.value);
  }

  public addFleets(fleets: Fleet[]): void {
    fleets.forEach(f => {
      this.entityMap.set(f.id, f);
      this.fleetsSubject.value.add(f);
    });
    this.fleetsSubject.next(this.fleetsSubject.value);
  }

  public removeFleet(fleet: Fleet): void {
    this.entityMap.delete(fleet.id);
    this.fleetsSubject.value.delete(fleet);
    this.fleetsSubject.next(this.fleetsSubject.value);
  }

  public getPlanets(): Observable<Set<Planet>> {
    return this.planetsSubject.asObservable();
  }

  public getColonies(): Observable<Set<Colony>> {
    return this.coloniesSubject.asObservable();
  }

  public getFleets(): Observable<Set<Fleet>> {
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
  
  public getStarTypeById(type: number): StarType {
    return STAR_TYPES[type - 1];
  }
  
  public getStarSizeById(size: number): StarSize {
    return STAR_SIZES[size - 1];
  }
  
  public getPlanetTypeById(type: number): PlanetType {
    return PLANET_TYPES[type - 1];
  }
  
  public getPlanetSizeById(size: number): PlanetSize {
    return PLANET_SIZES[size - 1];
  }

  public clear(): void {
    this.starSystemsSubject.next([]);
    this.planetsSubject.next(new Set());
    this.fleetsSubject.next(new Set());
    this.coloniesSubject.next(new Set());
    this.civilizationSubject.next(undefined);
    this.entityMap.clear();
  }
}
