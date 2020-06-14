import { Injectable } from '@angular/core';
import { PirosApiService, ApiServiceSession, ConnectionStatus } from '@piros/api';
import { Observable, BehaviorSubject, pipe, EMPTY, of, forkJoin } from 'rxjs';
import { Session } from '../dto/session';
import { FleetDetailDto } from '../dto/fleet-detail';
import * as API from './api-constants';
import { TransferShipsDto } from '../dto/transfer-ships-dto';
import { GalaxyDetailDto } from '../dto/galaxy-detail';
import { UserListDto } from '../modules/admin/services/users.service';
import { SessionState } from '../model/session.interface';
import { LocalStorageService } from './local-storage.service';
import { GvApiServiceStatus } from '../model/gv-api-service-status';
import { tap } from 'rxjs/operators';
import { StarSystemInfoDto } from '../dto/star-system-info';

@Injectable({
  providedIn: 'root'
})
export class GvApiService {

  private status: BehaviorSubject<GvApiServiceStatus>;

  constructor(
    private api: PirosApiService,
    private localStorageService: LocalStorageService
  ) {
    this.status = new BehaviorSubject({ sessionStarted: false });

    this.api.getStatus().subscribe(status => {
      if (status.connectionStatus === ConnectionStatus.FULLY_CONNECTED) {
        this.fetchInitialData();
      } else {
        this.status.next({ sessionStarted: false });
      }
    });

    const savedToken = localStorageService.getSavedToken();
    if (savedToken) {
      this.api.connectWithToken(savedToken).subscribe();
    }
  }

  private fetchInitialData(): void {
    forkJoin(
      this.api.request<StarSystemInfoDto[]>('galaxy.get-stars')
    ).subscribe(
      results => {
        const stars = results[0];

        this.status.next({ sessionStarted: true, stars: stars });
      }
      ,(e)=>{
        console.log('HHHHHHHHHHHHHHHHHHHHHHH',e);
      }
    );
  }

  public getStatus(): Observable<GvApiServiceStatus> {
    return this.status.asObservable();
  }

  public isReady(): Observable<boolean> {
    return null;
  }

  public setSessionstate(newState: SessionState): Observable<SessionState> {
    this.localStorageService.saveSessionState(newState);
    return of(newState);
  }

  public getSessionState(): Observable<SessionState> {
    return of(this.localStorageService.getSessionState());
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
    this.localStorageService.deleteSavedToken();
  }
  
  public login(username: string, password: string): Observable<ApiServiceSession> {
    return this.api.login(username, password).pipe(
      tap(session => {
        this.localStorageService.setSavedToken(session.authToken);
        this.setSessionstate(<any>{});
      })
    );
  }
  
  public register(username: string, password: string): Observable<string> {
    return this.api.post<string>('civilizations.register', { username: username, password: password });
  }

}
