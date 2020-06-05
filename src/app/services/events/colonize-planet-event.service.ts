import { Injectable } from '@angular/core';
import { ColonyManagerService } from '../data/colony-manager.service';
import { ColonizePlanetEvent } from 'src/app/dto/colonize-planet-event';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class ColonizePlanetEventService  {


  constructor(
    private eventService: EventService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getColonizePlanetEvents().subscribe(event => {
      this.processEvent(event);
    });
  }

  private processEvent(event: ColonizePlanetEvent) {
    this.colonyManagerService.addColony(event.colony);
  }

}