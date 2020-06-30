import { Injectable } from '@angular/core';
import { EndTravelEventService } from './end-travel-event.service';
import { StartTravelEventService } from './start-travel-event.service';
import { VisibilityGainedEventService } from './visibility-gained-event.service';
import { VisibilityLostEventService } from './visibility-lost-event.service';
import { DeleteFleetEventService } from './delete-fleet-event.service';
import { ColonizePlanetEventService } from './colonize-planet-event.service';
import { FinishBuildingShipEventService } from './finish-building-ship-event.service';
import { CreateBuildingOrderEventService } from './create-building-order-event.service';
import { UpdateFleetEventService } from './update-fleet-event.service';

@Injectable({
  providedIn: 'root'
})
export class EventManagerService {

  constructor(
    private endTravelEventService: EndTravelEventService,
    private startTravelEventService: StartTravelEventService,
    private visibilityGainedEventService: VisibilityGainedEventService,
    private visibilityLostEventService: VisibilityLostEventService,
    private deleteFleetEventService: DeleteFleetEventService,
    private colonizePlanetEventService: ColonizePlanetEventService,
    private finishBuildingShipEventService: FinishBuildingShipEventService,
    private createBuildingOrderEventService: CreateBuildingOrderEventService,
    private updateFleetEventService: UpdateFleetEventService,
  ) {
    
  }

  
}
