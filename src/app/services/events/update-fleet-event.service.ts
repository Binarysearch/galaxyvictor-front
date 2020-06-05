import { Injectable } from '@angular/core';
import { FleetManagerService } from '../data/fleet-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class UpdateFleetEventService {

  constructor(
    private eventService: EventService,
    private fleetManagerService: FleetManagerService
  ) {
    this.eventService.getUpdateFleetEvents().subscribe(event => {
      this.fleetManagerService.updateFleet(event.fleet);
    });
  }
}
