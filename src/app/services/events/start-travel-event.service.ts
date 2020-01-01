import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { StartTravelEvent } from '../../dto/start-travel-event';
import { Subject, Observable } from 'rxjs';
import { FleetInfoDto } from '../../dto/fleet-info';
import { Fleet } from '../../model/fleet';
import { Store } from '../data/store';
import { TimeService } from '../time.service';
import { FleetManagerService } from '../data/fleet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StartTravelEventService {

  private connection: ChannelConnection<StartTravelEvent>;
  private events: Subject<StartTravelEvent> = new Subject();

  constructor(
    private api: ApiService,
    private store: Store,
    private timeService: TimeService,
    private fleetManagerService: FleetManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<StartTravelEvent>('start-travel-events');
          this.connection.observable.subscribe(event => {
            this.events.next(event);
            this.fleetManagerService.updateFleet(event.fleet);
          });
        }
      }
    );
  }

  public getEvents(): Observable<StartTravelEvent> {
    return this.events.asObservable();
  }
  
}