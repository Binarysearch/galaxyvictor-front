import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { StartTravelEvent } from '../../dto/start-travel-event';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class StartTravelEventService {

  private connection: ChannelConnection<StartTravelEvent>;
  private events: Subject<StartTravelEvent> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<StartTravelEvent>('start-travel-events');
          this.connection.observable.subscribe(fleet => this.events.next(fleet));
        }
      }
    );
  }

  public getEvents(): Observable<StartTravelEvent> {
    return this.events.asObservable();
  }
}