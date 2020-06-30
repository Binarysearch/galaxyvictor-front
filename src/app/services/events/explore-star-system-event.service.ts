import { Injectable } from '@angular/core';
import { ExploreStarNotificationDto } from '../../dto/explore-star-notification';
import { FleetManagerService } from '../data/fleet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class ExploreStarSystemEventService {

  constructor(
    private eventService: EventService,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getExploreStarSystemEvents().subscribe(event => {
      this.processEvent(event);
    });
  }

  private processEvent(event: ExploreStarNotificationDto) {
    /*if (event.colonies && event.colonies.length > 0) {
      this.colonyManagerService.addColonies(event.colonies);
    }
    if (event.incomingFleets && event.incomingFleets.length > 0) {
      this.fleetManagerService.updateFleets(event.incomingFleets);
    }
    if (event.orbitingFleets && event.orbitingFleets.length > 0) {
      this.fleetManagerService.updateFleets(event.orbitingFleets);
    }*/
  }

}