import { Injectable } from '@angular/core';
import { ApiService, Session } from '@piros/api';
import { Observable } from 'rxjs';
import { SessionState } from '../model/session.interface';
import { FleetDetailDto } from '../dto/fleet-detail';
import * as API from './api-constants';
import { TransferShipsDto } from '../dto/transfer-ships-dto';
import { GalaxyDetailDto } from '../dto/galaxy-detail';
import { UserListDto } from '../modules/admin/services/users.service';

@Injectable({
  providedIn: 'root'
})
export class GvApiService {

  constructor(
    private api: ApiService
  ) { }

  public isReady(): Observable<boolean> {
    return this.api.isReady();
  }

  public setSessionstate(newState: SessionState): Observable<void> {
    return this.api.request('set-session-state', newState);
  }

  public getSessionState(): Observable<SessionState> {
    return this.api.getSessionState<SessionState>();
  }

  public getFleetDetail(fleetId: string): Observable<FleetDetailDto> {
    return this.api.request(API.GET_FLEET_DETAIL, fleetId);
  }
  
  public transferShips(dto: TransferShipsDto): Observable<void> {
    return this.api.request(API.TRANSFER_SHIPS, dto);
  }
  
  public getGalaxy(): Observable<GalaxyDetailDto> {
    return this.api.request<GalaxyDetailDto>('get-galaxy', 'test-galaxy');
  }

  public startTravel(fleet: string, destination: string) {
    return this.api.request(API.START_TRAVEL, { fleet: fleet, destination: destination });
  }

  public colonizePlanet(planet: string) {
    return this.api.request(API.COLONIZE_PLANET, { planet: planet });
  }

  public buildShip(colony: string) {
    return this.api.request(API.BUILD_SHIP, { colony: colony });
  }

  public createCivilization(name: string) {
    return this.api.request('create-civilization', name);
  }

  public getUsers(): Observable<UserListDto> {
    return this.api.request<UserListDto>('get-users', '');
  }
  
  public closeSession() {
    this.api.closeSession();
  }
  
  public login(username: string, password: string): Observable<Session> {
    return this.api.login(username, password);
  }
  
  public register(username: string, password: string): Observable<Session> {
    return this.api.register(username, password);
  }

}
