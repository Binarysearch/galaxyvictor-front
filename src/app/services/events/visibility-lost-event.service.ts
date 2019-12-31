import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { VisibilityLostEvent } from '../../dto/visibility-lost-event';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class VisibilityLostEventService {

  private connection: ChannelConnection<VisibilityLostEvent>;
  private events: Subject<VisibilityLostEvent> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<VisibilityLostEvent>('visibility-lost-events');
          this.connection.observable.subscribe(fleet => this.events.next(fleet));
        }
      }
    );
  }

  public getEvents(): Observable<VisibilityLostEvent> {
    return this.events.asObservable();
  }
}