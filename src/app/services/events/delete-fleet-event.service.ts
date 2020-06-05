import { Injectable } from '@angular/core';
import { FleetManagerService } from '../data/fleet-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class DeleteFleetEventService {

  constructor(
    private eventService: EventService,
    private fleetManagerService: FleetManagerService
  ) {
    this.eventService.getDeleteFleetEvents().subscribe(event => {
      this.deleteFleet(event.fleet);
    });
  }
  
  private deleteFleet(fleetId: string) {
    this.fleetManagerService.removeFleetById(fleetId);
  }
}