import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { PirosApiService } from '@piros/api';
import { ShipDto } from 'src/app/dto/ship-dto';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  constructor(
    private api: PirosApiService
  ) { }

  public getFleetShips(fleetyId: string): Observable<ShipDto[]> {
    return this.api.request<ShipDto[]>('get-fleet-ships', fleetyId);
  }

  public buildShip(colonyId: string): Observable<boolean> {
    return this.api.request<boolean>('build-ship', colonyId);
  }
}
