import { Injectable } from '@angular/core';
import { ApiService } from '@piros/api';
import * as API from './api-constants';

@Injectable({
  providedIn: 'root'
})
export class CommandService {

  constructor(
    private api: ApiService
  ) { }

  public startTravel(fleet: string, destination: string) {
    this.api.request(API.START_TRAVEL, { fleet: fleet, destination: destination });
  }

  public colonizePlanet(planet: string) {
    this.api.request(API.COLONIZE_PLANET, { planet: planet });
  }

  public buildShip(colony: string) {
    this.api.request(API.BUILD_SHIP, { colony: colony });
  }
  
}
