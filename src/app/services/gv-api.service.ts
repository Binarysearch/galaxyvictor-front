import { Injectable } from '@angular/core';
import { PirosApiService, ApiServiceSession, ConnectionStatus, ChannelConnection } from '@piros/api';
import { Observable, BehaviorSubject, of, Subscription, Subject } from 'rxjs';
import { FleetDetailDto } from '../dto/fleet-detail';
import * as API from './api-constants';
import { TransferShipsDto } from '../dto/transfer-ships-dto';
import { GalaxyDetailDto } from '../dto/galaxy-detail';
import { UserListDto } from '../modules/admin/services/users.service';
import { SessionState } from '../model/session.interface';
import { LocalStorageService } from './local-storage.service';
import { GvApiServiceStatus, Status } from '../model/gv-api-service-status';
import { tap } from 'rxjs/operators';
import { StarSystemInfoDto } from '../dto/star-system-info';
import { CivilizationDto } from '../dto/civilization/civilization-dto';
import { PlanetInfoDto } from '../dto/planet-info';

@Injectable({
  providedIn: 'root'
})
export class GvApiService {

  private status: BehaviorSubject<GvApiServiceStatus>;
  private civilizationSubject: BehaviorSubject<CivilizationDto>;

  constructor(
    private api: PirosApiService,
    private localStorageService: LocalStorageService
  ) {
    
    this.civilizationSubject = new BehaviorSubject(null);
    
    this.api.getStatus().subscribe(status => {
      if (status.connectionStatus === ConnectionStatus.FULLY_CONNECTED) {
        this.fetchInitialData();
        this.connectToChannels();
      } else {
        if (this.status) {
          this.status.next({ sessionStarted: Status.SESSION_CLOSED });
        } else {
          this.status = new BehaviorSubject({ sessionStarted: Status.SESSION_CLOSED });
        }
        this.civilizationSubject.next(null);
      }
    });

    const savedToken = localStorageService.getSavedToken();
    if (savedToken) {
      this.status = new BehaviorSubject({ sessionStarted: Status.SESSION_STARTING });
      this.api.connectWithToken(savedToken).subscribe();
    } else {
      this.status = new BehaviorSubject({ sessionStarted: Status.SESSION_CLOSED });
    }
  }
  
  private connectToChannels() {
    this.api.connectToChannel<CivilizationDto>('create-civilization').subscribe((channelConnection) => {
      channelConnection.messages.subscribe(message => {
        this.civilizationSubject.next(message);
      });
    });
  }

  private fetchInitialData(): void {
    this.api.request<CivilizationDto>('civilizations.get-civilization').subscribe(
      civilization => {

        this.civilizationSubject.next(civilization);
        this.status.next({ sessionStarted: Status.SESSION_STARTED, civilization: civilization });
      },
      (err) => {
        console.log(err);
      }
    );
  }

  public getStatus(): Observable<GvApiServiceStatus> {
    return this.status.asObservable();
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
  
  public getPlanets(): Observable<PlanetInfoDto[]> {
    return this.api.request<PlanetInfoDto[]>('get-planets');
  }
  
  public getStars(): Observable<StarSystemInfoDto[]> {
    return this.api.request<StarSystemInfoDto[]>('get-stars');
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

  public getCivilization(): Observable<CivilizationDto> {
    return this.civilizationSubject.asObservable();
  }

  public getUsers(): Observable<UserListDto> {
    return this.api.request<UserListDto>('get-users', '');
  }
  
  public closeSession() {
    this.localStorageService.deleteSavedToken();
    this.civilizationSubject.next(null);
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


function subscribeToNotifications<T>(api: PirosApiService, channelName: string, subject: Subject<T>) {

  let channelConnection: ChannelConnection<T>;
  let messagesSubscription: Subscription;
  let connectToChannelSubscription: Subscription;


  api.getStatus().subscribe(status => {
    if (status.connectionStatus === ConnectionStatus.FULLY_CONNECTED) {

      if (channelConnection) {
        channelConnection.close();
      }

      if (messagesSubscription) {
        messagesSubscription.unsubscribe();
      }

      if (connectToChannelSubscription) {
        connectToChannelSubscription.unsubscribe();
      }

      connectToChannelSubscription = api.connectToChannel<T>(channelName).subscribe(connection => {
        channelConnection = connection;
        messagesSubscription = connection.messages.subscribe(message => {
          subject.next(message);
        });
      });
    }
  });
}