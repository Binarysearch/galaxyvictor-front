import { Injectable } from '@angular/core';
import { VisibilityGainedEvent } from '../../dto/visibility-gained-event';
import { FleetManagerService } from '../data/fleet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class VisibilityGainedEventService {

  constructor(
    private eventService: EventService,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getVisibilityGainedEvents().subscribe(event => {
      this.processEvent(event);
    });
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