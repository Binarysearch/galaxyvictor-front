import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { ColonyManagerService } from '../data/colony-manager.service';
import { CreateBuildingOrderEvent } from 'src/app/dto/create-building-order-event';

@Injectable({
  providedIn: 'root'
})
export class CreateBuildingOrderEventService {

  private connection: ChannelConnection<CreateBuildingOrderEvent>;

  constructor(
    private api: ApiService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<CreateBuildingOrderEvent>('create-building-order-events');
          this.connection.observable.subscribe(event => {
            this.processEvent(event);
          });
        }
      }
    );
  }

  private processEvent(event: CreateBuildingOrderEvent) {
    this.colonyManagerService.updateColony(event.colony);
  }

}