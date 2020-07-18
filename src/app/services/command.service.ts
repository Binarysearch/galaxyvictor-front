import { Injectable } from '@angular/core';
import { GvApiService } from './gv-api.service';
import { FleetsService } from './data/fleets.service';
import { ColoniesService } from './data/colonies.service';
import { ShipsService } from './data/ships.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private api: GvApiService,
    private fleetsService: FleetsService,
    private shipsService: ShipsService,
    private coloniesService: ColoniesService,
  ) { }

  public startTravel(fleet: string, origin: string, destination: string) {
    this.fleetsService.startTravel(fleet, origin, destination).subscribe();
  }

  public colonizePlanet(planet: string) {
    this.coloniesService.createColony(planet).subscribe();
  }

  public buildShip(colony: string) {
    this.shipsService.buildShip(colony).subscribe();
  }
  
}
