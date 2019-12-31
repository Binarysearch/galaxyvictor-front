import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { EndTravelEvent } from '../../dto/end-travel-event';
import { Subject, Observable } from 'rxjs';
import { FleetInfoDto } from '../../dto/fleet-info';
import { Fleet } from '../../model/fleet';
import { Store } from '../data/store';
import { TimeService } from '../time.service';

@Injectable({
  providedIn: 'root'
})
export class EndTravelEventService {

  private connection: ChannelConnection<EndTravelEvent>;
  private events: Subject<EndTravelEvent> = new Subject();

  constructor(
    private api: ApiService,
    private store: Store,
    private timeService: TimeService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<EndTravelEvent>('end-travel-events');
          this.connection.observable.subscribe(event => {
            this.events.next(event);
            this.updateFleet(event.fleet);
          });
        }
      }
    );
  }

  public getEvents(): Observable<EndTravelEvent> {
    return this.events.asObservable();
  }

  private updateFleet(fleetDto: FleetInfoDto) {
    const fleet = new Fleet(
      fleetDto.id,
      fleetDto.seed,
      fleetDto.speed,
      fleetDto.startTravelTime,
      this.store.getStarSystemById(fleetDto.destinationId),
      this.store.getStarSystemById(fleetDto.originId),
      this.store.getCivilizationById(fleetDto.civilizationId),
      this.timeService
    );
    this.store.removeFleet(fleet);
    this.store.addFleets([fleet]);
  }
}
