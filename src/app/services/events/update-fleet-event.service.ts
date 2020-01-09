import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { EndTravelEvent } from '../../dto/end-travel-event';
import { FleetManagerService } from '../data/fleet-manager.service';
import { UpdateFleetEvent } from 'src/app/dto/update-fleet-event';

@Injectable({
  providedIn: 'root'
})
export class UpdateFleetEventService {

  private connection: ChannelConnection<UpdateFleetEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<UpdateFleetEvent>('update-fleet-events');
          this.connection.observable.subscribe(event => {
            this.fleetManagerService.updateFleet(event.fleet);
          });
        }
      }
    );
  }
}
