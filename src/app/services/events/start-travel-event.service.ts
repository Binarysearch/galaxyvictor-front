import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { StartTravelEvent } from '../../dto/start-travel-event';
import { FleetManagerService } from '../data/fleet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class StartTravelEventService {

  private connection: ChannelConnection<StartTravelEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<StartTravelEvent>('start-travel-events');
          this.connection.observable.subscribe(event => {
            this.fleetManagerService.updateFleet(event.fleet);
          });
        }
      }
    );
  }
  
}