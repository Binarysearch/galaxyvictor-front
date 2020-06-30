import { Injectable } from '@angular/core';
import { PirosApiService } from '@piros/api';
import { Subject, Observable } from 'rxjs';
import { StartTravelNotificationDto } from '../dto/start-travel-notification';
import { EndTravelNotificationDto } from '../dto/end-travel-notification';
import { DeleteFleetNotificationDto } from '../dto/delete-fleet-notification';
import { subscribeToNotifications } from './channel-utils';
import { VisibilityGainedNotificationDto } from '../dto/visibility-gained-notification';
import { VisibilityLostNotificationDto } from '../dto/visibility-lost-notidication';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private startTravelNotificationSubject: Subject<StartTravelNotificationDto> = new Subject();
  private endTravelNotificationSubject: Subject<EndTravelNotificationDto> = new Subject();
  private deleteFleetNotificationSubject: Subject<DeleteFleetNotificationDto> = new Subject();
  private visibilityGainNotificationSubject: Subject<VisibilityGainedNotificationDto> = new Subject();
  private visibilityLostNotificationSubject: Subject<VisibilityLostNotificationDto> = new Subject();

  constructor(
    private api: PirosApiService
  ) {
    subscribeToNotifications(this.api, 'start-travel-notifications', this.startTravelNotificationSubject);
    subscribeToNotifications(this.api, 'end-travel-notifications', this.endTravelNotificationSubject);
    subscribeToNotifications(this.api, 'delete-fleet-notifications', this.deleteFleetNotificationSubject);
    subscribeToNotifications(this.api, 'visibility-gain-notifications', this.visibilityGainNotificationSubject);
    subscribeToNotifications(this.api, 'visibility-lost-notifications', this.visibilityLostNotificationSubject);
  }

  public getStartTravelEvents(): Observable<StartTravelNotificationDto> {
    return this.startTravelNotificationSubject.asObservable();
  }

  public getEndTravelEvents(): Observable<EndTravelNotificationDto> {
    return this.endTravelNotificationSubject.asObservable();
  }

  public getDeleteFleetEvents(): Observable<DeleteFleetNotificationDto> {
    return this.deleteFleetNotificationSubject.asObservable();
  }

  public getVisibilityGainNotification(): Observable<VisibilityGainedNotificationDto> {
    return this.visibilityGainNotificationSubject.asObservable();
  }

  public getVisibilityLostNotification(): Observable<VisibilityLostNotificationDto> {
    return this.visibilityLostNotificationSubject.asObservable();
  }
}
