import { Injectable } from '@angular/core';
import { Entity } from './render/renderer.interface';
import { Fleet } from '../model/fleet';
import { StarSystem } from '../model/star-system';
import { Civilization } from '../model/civilization';
import { CivilizationsService } from './data/civilizations.service';

@Injectable({
  providedIn: 'root'
})
export class ConstraintService {

  private civilization: Civilization;

  constructor(
    private civilizationsService: CivilizationsService
  ) {
    this.civilizationsService.getCivilization().subscribe(civilization => this.civilization = civilization);
  }

  public canStartTravelTo(traveller: Entity, destination: Entity): boolean {
    return traveller instanceof Fleet && 
      destination instanceof StarSystem &&
      !traveller.isTravelling &&
      traveller.origin.id !== destination.id &&
      traveller.civilization.id === this.civilization.id
  }
}
