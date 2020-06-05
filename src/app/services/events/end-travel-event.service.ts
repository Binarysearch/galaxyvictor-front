import { Injectable } from '@angular/core';
import { FleetManagerService } from '../data/fleet-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class EndTravelEventService {

  constructor(
    private eventService: EventService,
    private fleetManagerService: FleetManagerService
  ) {
    this.eventService.getEndTravelEvents().subscribe(event => {
      this.fleetManagerService.updateFleet(event.fleet);
    });
  }
}
