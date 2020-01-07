import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { FleetManagerService } from '../data/fleet-manager.service';
import { FinishBuildingShipEvent } from '../../dto/finish-building-ship-event';
import { ColonyManagerService } from '../data/colony-manager.service';

@Injectable({
  providedIn: 'root'
})
export class FinishBuildingShipEventService {

  private connection: ChannelConnection<FinishBuildingShipEvent>;

  constructor(
    private api: ApiService,
    private fleetManagerService: FleetManagerService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<FinishBuildingShipEvent>('finish-building-ship-events');
          this.connection.observable.subscribe(event => {
            this.processEvent(event);
          });
        }
      }
    );
  }

  private processEvent(event: FinishBuildingShipEvent) {
    this.fleetManagerService.updateFleet(event.fleet);
    this.colonyManagerService.updateColony(event.colony);
  }

}