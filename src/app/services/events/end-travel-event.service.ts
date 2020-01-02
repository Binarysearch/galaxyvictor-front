import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { EndTravelEvent } from '../../dto/end-travel-event';
import { FleetManagerService } from '../data/fleet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class EndTravelEventService {

  private connection: ChannelConnection<EndTravelEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<EndTravelEvent>('end-travel-events');
          this.connection.observable.subscribe(event => {
            this.fleetManagerService.updateFleet(event.fleet);
          });
        }
      }
    );
  }
}
