import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem } from '../../model/star-system';
import { BehaviorSubject, Observable } from 'rxjs';
import { Fleet } from '../../model/fleet';
import { Civilization } from '../../model/civilization';
import { Colony } from '../../model/colony';
import { StarsService } from './stars.service';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private coloniesSubject: BehaviorSubject<Set<Colony>> = new BehaviorSubject(new Set());

  private fleetsSubject: BehaviorSubject<Set<Fleet>> = new BehaviorSubject(new Set());

  private civilizationSubject: BehaviorSubject<Civilization> = new BehaviorSubject(undefined);
  
  constructor(
    private starsService: StarsService
  ) {
    
  }

  public setCivilization(civilization: Civilization) {
    this.civilizationSubject.next(civilization);
  }
  
  public addCivilization(civilization: Civilization) {
    this.entityMap.set(civilization.id, <any>civilization);
  }

  public getFleetById(id: string): Fleet {
    return <Fleet>this.entityMap.get(id);
  }

  public getColonyById(id: string): Colony {
    return <Colony>this.entityMap.get(id);
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

  public getColonies(): Observable<Set<Colony>> {
    return this.coloniesSubject.asObservable();
  }

  public getStarSystems(): Observable<StarSystem[]> {
    return this.starsService.getStars();
  }

  public getCivilization(): Observable<Civilization> {
    return this.civilizationSubject.asObservable();
  }

  public clear(): void {
    this.fleetsSubject.next(new Set());
    this.coloniesSubject.next(new Set());
    this.civilizationSubject.next(undefined);
    this.entityMap.clear();
  }
}
