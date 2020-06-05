import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { FleetDetailDto } from '../../../dto/fleet-detail';
import { TransferShipsDto } from '../../../dto/transfer-ships-dto';
import { GvApiService } from '../../gv-api.service';

@Injectable({
  providedIn: 'root'
})
export class ShipsService {

  constructor(
    private api: GvApiService
  ) { }

  public getFleetDetail(fleetId: string): Observable<FleetDetailDto> {
    return this.api.getFleetDetail(fleetId);
  }
  
  public transferShips(dto: TransferShipsDto): Observable<void> {
    return this.api.transferShips(dto);
  }
  
}
