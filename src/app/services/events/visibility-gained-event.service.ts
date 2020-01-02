import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { VisibilityGainedEvent } from '../../dto/visibility-gained-event';
import { FleetManagerService } from '../data/fleet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';

@Injectable({
  providedIn: 'root'
})
export class VisibilityGainedEventService {

  private connection: ChannelConnection<VisibilityGainedEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<VisibilityGainedEvent>('visibility-gained-events');
          this.connection.observable.subscribe(event => {
            this.processEvent(event);
          });
        }
      }
    );
  }

  private processEvent(event: VisibilityGainedEvent) {
    if (event.colonies && event.colonies.length > 0) {
      this.colonyManagerService.addColonies(event.colonies);
    }
    if (event.incomingFleets && event.incomingFleets.length > 0) {
      this.fleetManagerService.updateFleets(event.incomingFleets);
    }
    if (event.orbitingFleets && event.orbitingFleets.length > 0) {
      this.fleetManagerService.updateFleets(event.orbitingFleets);
    }
  }
}