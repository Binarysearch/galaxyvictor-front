import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { ColonyManagerService } from '../data/colony-manager.service';
import { ColonizePlanetEvent } from 'src/app/dto/colonize-planet-event';

@Injectable({
  providedIn: 'root'
})
export class ColonizePlanetEventService  {

  private connection: ChannelConnection<ColonizePlanetEvent>;

  constructor(
    private api: ApiService,
    private colonyManagerService: ColonyManagerService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<ColonizePlanetEvent>('colonize-planet-events');
          this.connection.observable.subscribe(event => {
            this.processEvent(event);
          });
        }
      }
    );
  }

  private processEvent(event: ColonizePlanetEvent) {
    this.colonyManagerService.addColony(event.colony);
  }

}