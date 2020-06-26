import { Injectable } from '@angular/core';
import { PirosApiService } from '@piros/api';
import { Subject, Observable } from 'rxjs';
import { VisibilityGainedNotificationDto } from '../../dto/visibility-gained-notification';
import { subscribeToNotifications } from '../channel-utils';

@Injectable({
  providedIn: 'root'
})
export class VisibilityEventsService {

  private visibilityGainNotificationSubject: Subject<VisibilityGainedNotificationDto> = new Subject();
  
  constructor(
    private api: PirosApiService
  ) {
    subscribeToNotifications(this.api, 'visibility-gain-notifications', this.visibilityGainNotificationSubject);
  }

  public getVisibilityGainNotification(): Observable<VisibilityGainedNotificationDto> {
    return this.visibilityGainNotificationSubject.asObservable();
  }
}
