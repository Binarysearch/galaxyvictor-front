import { Injectable } from '@angular/core';
import { FleetManagerService } from '../data/fleet-manager.service';
import { FinishBuildingShipEvent } from '../../dto/finish-building-ship-event';
import { ColonyManagerService } from '../data/colony-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class FinishBuildingShipEventService {

  constructor(
    private eventService: EventService,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getFinishBuildingShipEvents().subscribe(event => {
      this.processEvent(event);
    });
  }

  private processEvent(event: FinishBuildingShipEvent) {
    this.fleetManagerService.updateFleet(event.fleet);
    this.colonyManagerService.updateColony(event.colony);
  }

}