import { Injectable } from '@angular/core';
import { PirosApiService } from '@piros/api';
import { Subject, Observable } from 'rxjs';
import { VisibilityGainedNotificationDto } from '../../dto/visibility-gained-notification';
import { subscribeToNotifications } from '../channel-utils';
import { VisibilityLostNotificationDto } from '../../dto/visibility-lost-notidication';

@Injectable({
  providedIn: 'root'
})
export class VisibilityEventsService {

  private visibilityGainNotificationSubject: Subject<VisibilityGainedNotificationDto> = new Subject();
  private visibilityLostNotificationSubject: Subject<VisibilityLostNotificationDto> = new Subject();
  
  constructor(
    private api: PirosApiService
  ) {
    subscribeToNotifications(this.api, 'visibility-gain-notifications', this.visibilityGainNotificationSubject);
    subscribeToNotifications(this.api, 'visibility-lost-notifications', this.visibilityLostNotificationSubject);
  }

  public getVisibilityGainNotification(): Observable<VisibilityGainedNotificationDto> {
    return this.visibilityGainNotificationSubject.asObservable();
  }

  public getVisibilityLostNotification(): Observable<VisibilityLostNotificationDto> {
    return this.visibilityLostNotificationSubject.asObservable();
  }
}
