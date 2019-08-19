import { Injectable } from '@angular/core';
import { Entity } from '../render/renderer.interface';
import { StarSystem } from 'src/app/model/star-system.interface';
import { Subject, BehaviorSubject, Observable } from 'rxjs';
import { ApiService } from '../api.service';

@Injectable({
  providedIn: 'root'
})
export class Store {

  private entityMap: Map<string, Entity> = new Map();

  private starSystems: StarSystem[] = [];
  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  constructor() { }

  public setStarSystems(starSystems: StarSystem[]): void {
    this.starSystems.forEach(ss => this.entityMap.delete(ss.id));
    this.starSystems = starSystems;
    this.starSystems.forEach(ss => this.entityMap.set(ss.id, ss));
    this.starSystemsSubject.next(this.starSystems);
  }

  public getStarSystems(): Observable<StarSystem[]> {
    return this.starSystemsSubject.asObservable();
  }

  public getEntity(id: string): Entity {
    return this.entityMap.get(id);
  }
}