import { Injectable } from '@angular/core';
import { Entity } from './render/renderer.interface';
import { Fleet } from '../model/fleet';
import { StarSystem } from '../model/star-system';
import { Store } from './data/store';
import { Civilization } from '../model/civilization';

@Injectable({
  providedIn: 'root'
})
export class ConstraintService {

  private civilization: Civilization;

  constructor(
    private store: Store
  ) {
    this.store.getCivilization().subscribe(civilization => this.civilization = civilization);
  }

  public canStartTravelTo(traveller: Entity, destination: Entity): boolean {
    return traveller instanceof Fleet && 
      destination instanceof StarSystem &&
      !traveller.isTravelling &&
      traveller.origin.id !== destination.id &&
      traveller.civilization.id === this.civilization.id
  }
}
