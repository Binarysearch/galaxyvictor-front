import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { ExploreStarSystemEvent } from '../../dto/explore-star-system-event';
import { Subject, Observable } from 'rxjs';
import { ColonyInfoDto } from 'src/app/dto/colony-info';
import { PlanetInfoDto } from 'src/app/dto/planet-info';
import { Store } from '../data/store';
import { TimeService } from '../time.service';
import { Planet } from 'src/app/model/planet';
import { Colony } from 'src/app/model/colony';
import { FleetManagerService } from '../data/fleet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class ExploreStarSystemEventService {

  private connection: ChannelConnection<ExploreStarSystemEvent>;
  private events: Subject<ExploreStarSystemEvent> = new Subject();

  constructor(
    private api: ApiService,
    private store: Store,
    private timeService: TimeService,
    private fleetManagerService: FleetManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<ExploreStarSystemEvent>('explore-star-system-events');
          this.connection.observable.subscribe(event => {
            this.events.next(event);
            this.processEvent(event);
          });
        }
      }
    );
  }

  public getEvents(): Observable<ExploreStarSystemEvent> {
    return this.events.asObservable();
  }

  private processEvent(event: ExploreStarSystemEvent) {
    if (event.planets && event.planets.length > 0) {
      this.updatePlanets(event.planets);
    }
    if (event.colonies && event.colonies.length > 0) {
      this.updateColonies(event.colonies);
    }
    if (event.incomingFleets && event.incomingFleets.length > 0) {
      this.fleetManagerService.updateFleets(event.incomingFleets);
    }
    if (event.orbitingFleets && event.orbitingFleets.length > 0) {
      this.fleetManagerService.updateFleets(event.orbitingFleets);
    }
  }
  
  private updatePlanets(planets: PlanetInfoDto[]) {
    planets.forEach(p => {
      const planet = new Planet(
        p.id,
        p.type,
        p.size,
        p.orbit,
        this.store.getStarSystemById(p.starSystem)
      );
      this.store.removePlanet(planet);
      this.store.addPlanets([planet]);
    });
  }

  private updateColonies(colonies: ColonyInfoDto[]) {
    colonies.forEach(c => {
      const planet = this.store.getPlanetById(c.planet);
      const colony = new Colony(
        c.id,
        planet, 
        this.store.getCivilizationById(c.civilizationId)
      );
      planet.colony = colony;
      this.store.removeColony(colony);
      this.store.addColonies([colony]);
    });
  }

}