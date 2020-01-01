import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { DeleteFleetEvent } from '../../dto/delete-fleet-event';
import { Subject, Observable } from 'rxjs';
import { Store } from '../data/store';

@Injectable({
  providedIn: 'root'
})
export class DeleteFleetEventService {

  private connection: ChannelConnection<DeleteFleetEvent>;
  private events: Subject<DeleteFleetEvent> = new Subject();

  constructor(
    private api: ApiService,
    private store: Store
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<DeleteFleetEvent>('delete-fleet-events');
          this.connection.observable.subscribe(event => {
            this.events.next(event);
            this.deleteFleet(event.fleet);
          });
        }
      }
    );
  }

  public getEvents(): Observable<DeleteFleetEvent> {
    return this.events.asObservable();
  }
  
  private deleteFleet(fleetId: string) {
    const fleet = this.store.getFleetById(fleetId);
    this.store.removeFleet(fleet);
  }
}