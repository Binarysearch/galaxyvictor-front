import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { VisibilityLostEvent } from '../../dto/visibility-lost-event';
import { Store } from '../data/store';
import { FleetManagerService } from '../data/fleet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';
import { Fleet } from 'src/app/model/fleet';

@Injectable({
  providedIn: 'root'
})
export class VisibilityLostEventService {

  private connection: ChannelConnection<VisibilityLostEvent>;

  constructor(
    private api: ApiService,
    private store: Store,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<VisibilityLostEvent>('visibility-lost-events');
          this.connection.observable.subscribe(event => {
            this.processEvent(event);
          });
        }
      }
    );
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