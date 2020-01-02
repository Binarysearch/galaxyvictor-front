import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { DeleteFleetEvent } from '../../dto/delete-fleet-event';
import { FleetManagerService } from '../data/fleet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteFleetEventService {

  private connection: ChannelConnection<DeleteFleetEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<DeleteFleetEvent>('delete-fleet-events');
          this.connection.observable.subscribe(event => {
            this.deleteFleet(event.fleet);
          });
        }
      }
    );
  }
  
  private deleteFleet(fleetId: string) {
    this.fleetManagerService.removeFleetById(fleetId);
  }
}