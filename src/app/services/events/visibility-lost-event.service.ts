import { Injectable } from '@angular/core';
import { VisibilityLostNotificationDto } from '../../dto/visibility-lost-notidication';
import { Store } from '../data/store';
import { FleetManagerService } from '../data/fleet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';
import { Fleet } from 'src/app/model/fleet';
import { EventService } from '../event.service';
import { StarsService } from '../data/stars.service';

@Injectable({
  providedIn: 'root'
})
export class VisibilityLostEventService {

  constructor(
    private eventService: EventService,
    private starsService: StarsService,
    private store: Store,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getVisibilityLostEvents().subscribe(event => {
      this.processEvent(event);
    });
  }

  private processEvent(event: VisibilityLostNotificationDto) {
    const starSystem = this.starsService.getStarById(event.starId);
    this.removeFleets(starSystem.incomingFleets);
    this.removeFleets(starSystem.orbitingFleets);
    starSystem.planets.forEach(p => {
      if (p.colony && !p.colony.civilization.playerCivilization) {
        this.colonyManagerService.removeColony(p.colony);
      }
    });
  }

  private removeFleets(fleets: Set<Fleet>) {
    fleets.forEach(f => {
      if (!f.civilization.playerCivilization) {
        this.fleetManagerService.removeFleet(f);
      }
    });
  }
}