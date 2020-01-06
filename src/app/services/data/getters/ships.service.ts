import { Injectable } from '@angular/core';
import { ApiService } from '@piros/api';
import { Observable } from 'rxjs';
import { FleetDetailDto } from '../../../dto/fleet-detail';
import * as API from '../../api-constants';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  constructor(
    private api: ApiService
  ) { }

  public getFleetDetail(fleetId: string): Observable<FleetDetailDto> {
    return this.api.request(API.GET_FLEET_DETAIL, fleetId);
  }
  
}
