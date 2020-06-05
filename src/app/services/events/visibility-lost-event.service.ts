import { Injectable } from '@angular/core';
import { VisibilityLostEvent } from '../../dto/visibility-lost-event';
import { Store } from '../data/store';
import { FleetManagerService } from '../data/fleet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';
import { Fleet } from 'src/app/model/fleet';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class VisibilityLostEventService {

  constructor(
    private eventService: EventService,
    private store: Store,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getVisibilityLostEvents().subscribe(event => {
      this.processEvent(event);
    });
  }

  private processEvent(event: VisibilityLostEvent) {
    const starSystem = this.store.getStarSystemById(event.starSystem);
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