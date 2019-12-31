import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { EndTravelEvent } from '../../dto/end-travel-event';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class EndTravelEventService {

  private connection: ChannelConnection<EndTravelEvent>;
  private events: Subject<EndTravelEvent> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<EndTravelEvent>('end-travel-events');
          this.connection.observable.subscribe(fleet => this.events.next(fleet));
        }
      }
    );
  }

  public getEvents(): Observable<EndTravelEvent> {
    return this.events.asObservable();
  }
}
