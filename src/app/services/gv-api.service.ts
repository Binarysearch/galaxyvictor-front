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

  constructor(
    private api: PirosApiService,
    private localStorageService: LocalStorageService
  ) {
    
    
    this.api.getStatus().subscribe(status => {
      if (status.connectionStatus === ConnectionStatus.FULLY_CONNECTED) {
        
      } else {
        if (this.status) {
          this.status.next({ sessionStarted: Status.SESSION_CLOSED });
        } else {
          this.status = new BehaviorSubject({ sessionStarted: Status.SESSION_CLOSED });
        }
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

  public getStatus(): Observable<GvApiServiceStatus> {
    return this.status.asObservable();
  }

  public getFleetDetail(fleetId: string): Observable<FleetDetailDto> {
    return this.api.request(API.GET_FLEET_DETAIL, fleetId);
  }
  
  public transferShips(dto: TransferShipsDto): Observable<void> {
    return this.api.request(API.TRANSFER_SHIPS, dto);
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

  public getUsers(): Observable<UserListDto> {
    return this.api.request<UserListDto>('get-users', '');
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