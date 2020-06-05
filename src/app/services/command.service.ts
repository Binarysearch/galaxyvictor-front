import { Injectable } from '@angular/core';
import { GvApiService } from './gv-api.service';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private api: GvApiService
  ) { }

  public startTravel(fleet: string, destination: string) {
    this.api.startTravel(fleet, destination).subscribe();
  }

  public colonizePlanet(planet: string) {
    this.api.colonizePlanet(planet).subscribe();
  }

  public buildShip(colony: string) {
    this.api.buildShip(colony).subscribe();
  }
  
}
