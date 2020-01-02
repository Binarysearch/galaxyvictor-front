import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { ExploreStarSystemEvent } from '../../dto/explore-star-system-event';
import { FleetManagerService } from '../data/fleet-manager.service';
import { PlanetManagerService } from '../data/planet-manager.service';
import { ColonyManagerService } from '../data/colony-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ExploreStarSystemEventService {

  private connection: ChannelConnection<ExploreStarSystemEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService,
    private planetManagerService: PlanetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<ExploreStarSystemEvent>('explore-star-system-events');
          this.connection.observable.subscribe(event => {
            this.processEvent(event);
          });
        }
      }
    );
  }

  private processEvent(event: ExploreStarSystemEvent) {
    if (event.planets && event.planets.length > 0) {
      this.planetManagerService.addPlanets(event.planets);
    }
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