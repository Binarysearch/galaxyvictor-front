import { Injectable } from '@angular/core';
import { ChannelConnection, ApiService } from '@piros/api';
import { ExploreStarSystemEvent } from '../../dto/explore-star-system-event';
import { Subject, Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ExploreStarSystemEventService {

  private connection: ChannelConnection<ExploreStarSystemEvent>;
  private events: Subject<ExploreStarSystemEvent> = new Subject();

  constructor(
    private api: ApiService
  ) {
    this.api.isReady().subscribe(
      ready => {
        if (ready) {
          this.connection = this.api.connectToChannel<ExploreStarSystemEvent>('explore-star-system-events');
          this.connection.observable.subscribe(fleet => this.events.next(fleet));
        }
      }
    );
  }

  public getEvents(): Observable<ExploreStarSystemEvent> {
    return this.events.asObservable();
  }
}