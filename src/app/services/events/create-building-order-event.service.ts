import { Injectable } from '@angular/core';
import { ColonyManagerService } from '../data/colony-manager.service';
import { CreateBuildingOrderEvent } from 'src/app/dto/create-building-order-event';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class CreateBuildingOrderEventService {


  constructor(
    private eventService: EventService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.eventService.getCreateBuildingOrderEvents().subscribe(event => {
      this.processEvent(event);
    });
  }

  private processEvent(event: CreateBuildingOrderEvent) {
    this.colonyManagerService.updateColony(event.colony);
  }

}