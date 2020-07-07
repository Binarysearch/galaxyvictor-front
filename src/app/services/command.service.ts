import { Injectable } from '@angular/core';
import { GvApiService } from './gv-api.service';
import { FleetsService } from './data/fleets.service';
import { ColoniesService } from './data/colonies.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private api: GvApiService,
    private fleetsService: FleetsService,
    private coloniesService: ColoniesService,
  ) { }

  public startTravel(fleet: string, origin: string, destination: string) {
    this.fleetsService.startTravel(fleet, origin, destination).subscribe();
  }

  public colonizePlanet(planet: string) {
    this.coloniesService.createColony(planet).subscribe();
  }

  public buildShip(colony: string) {
    this.api.buildShip(colony).subscribe();
  }
  
}
