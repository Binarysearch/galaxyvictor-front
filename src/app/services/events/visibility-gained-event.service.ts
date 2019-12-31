import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { VisibilityGainedEvent } from '../../dto/visibility-gained-event';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisibilityGainedEventService {

  private connection: ChannelConnection<VisibilityGainedEvent>;
  private events: Subject<VisibilityGainedEvent> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<VisibilityGainedEvent>('visibility-gained-events');
          this.connection.observable.subscribe(fleet => this.events.next(fleet));
        }
      }
    );
  }

  public getEvents(): Observable<VisibilityGainedEvent> {
    return this.events.asObservable();
  }
}