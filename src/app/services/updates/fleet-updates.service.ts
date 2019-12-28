import { Injectable } from '@angular/core';
import { ApiService, ChannelConnection } from '@piros/api';
import { FleetInfoDto } from 'src/app/dto/fleet-info';
import { Observable, Subject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FleetUpdatesService {

  private connection: ChannelConnection<FleetInfoDto>;
  private fleetUpdates: Subject<FleetInfoDto> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<FleetInfoDto>('fleet-updates');
          this.connection.observable.subscribe(fleet => this.fleetUpdates.next(fleet));
        }
      }
    );
  }

  public getFleetUpdates(): Observable<FleetInfoDto> {
    return this.fleetUpdates.asObservable();
  }
}
