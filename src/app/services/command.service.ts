import { Injectable } from '@angular/core';
import { GvApiService } from './gv-api.service';
import { FleetsService } from './data/fleets.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private api: GvApiService,
    private fleetsService: FleetsService,
  ) { }

  public startTravel(fleet: string, origin: string, destination: string) {
    this.fleetsService.startTravel(fleet, origin, destination).subscribe();
  }

  public colonizePlanet(planet: string) {
    this.api.colonizePlanet(planet).subscribe();
  }

  public buildShip(colony: string) {
    this.api.buildShip(colony).subscribe();
  }
  
}
