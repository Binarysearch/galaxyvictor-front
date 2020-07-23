import { Injectable } from '@angular/core';
import { PirosApiService } from '@piros/api';
import { Subject, Observable } from 'rxjs';
import { StartTravelNotificationDto } from '../dto/start-travel-notification';
import { EndTravelNotificationDto } from '../dto/end-travel-notification';
import { DeleteFleetNotificationDto } from '../dto/delete-fleet-notification';
import { subscribeToNotifications } from './channel-utils';
import { VisibilityGainedNotificationDto } from '../dto/visibility-gained-notification';
import { VisibilityLostNotificationDto } from '../dto/visibility-lost-notidication';
import { CreateColonyNotificationDto } from '../dto/create-colony-notification';
import { CreateShipNotificationDto } from '../dto/create-ship-notification';
import { BuildingOrdersNotificationDto } from '../dto/building-orders-notification';
import { ExploreStarNotificationDto } from '../dto/explore-star-notification';
import { CivilizationMeetNotificationDto } from '../dto/civilization-meet-notification';

@Injectable({
  providedIn: 'root'
})
export class NotificationService {

  private startTravelNotificationSubject: Subject<StartTravelNotificationDto> = new Subject();
  private endTravelNotificationSubject: Subject<EndTravelNotificationDto> = new Subject();
  private deleteFleetNotificationSubject: Subject<DeleteFleetNotificationDto> = new Subject();
  private visibilityGainNotificationSubject: Subject<VisibilityGainedNotificationDto> = new Subject();
  private visibilityLostNotificationSubject: Subject<VisibilityLostNotificationDto> = new Subject();
  private createColonyNotificationSubject: Subject<CreateColonyNotificationDto> = new Subject();
  private createShipNotificationSubject: Subject<CreateShipNotificationDto> = new Subject();
  private buildingOrdersNotificationSubject: Subject<BuildingOrdersNotificationDto> = new Subject();
  private exploreStarNotificationsSubject: Subject<ExploreStarNotificationDto> = new Subject();
  private civilizationMeetNotifications: Subject<CivilizationMeetNotificationDto> = new Subject();

  constructor(
    private api: PirosApiService
  ) {
    subscribeToNotifications(this.api, 'start-travel-notifications', this.startTravelNotificationSubject);
    subscribeToNotifications(this.api, 'end-travel-notifications', this.endTravelNotificationSubject);
    subscribeToNotifications(this.api, 'delete-fleet-notifications', this.deleteFleetNotificationSubject);
    subscribeToNotifications(this.api, 'visibility-gain-notifications', this.visibilityGainNotificationSubject);
    subscribeToNotifications(this.api, 'visibility-lost-notifications', this.visibilityLostNotificationSubject);
    subscribeToNotifications(this.api, 'create-colony-notifications', this.createColonyNotificationSubject);
    subscribeToNotifications(this.api, 'create-ship-notifications', this.createShipNotificationSubject);
    subscribeToNotifications(this.api, 'building-orders-notifications', this.buildingOrdersNotificationSubject);
    subscribeToNotifications(this.api, 'explore-star-notifications', this.exploreStarNotificationsSubject);
    subscribeToNotifications(this.api, 'civilization-meet-notifications', this.civilizationMeetNotifications);
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

  public getVisibilityGainNotifications(): Observable<VisibilityGainedNotificationDto> {
    return this.visibilityGainNotificationSubject.asObservable();
  }

  public getVisibilityLostNotifications(): Observable<VisibilityLostNotificationDto> {
    return this.visibilityLostNotificationSubject.asObservable();
  }

  public getCreateColonyNotifications(): Observable<CreateColonyNotificationDto> {
    return this.createColonyNotificationSubject.asObservable();
  }

  public getCreateShipNotifications(): Observable<CreateShipNotificationDto> {
    return this.createShipNotificationSubject.asObservable();
  }

  public getBuildingOrdersNotifications(): Observable<BuildingOrdersNotificationDto> {
    return this.buildingOrdersNotificationSubject.asObservable();
  }

  public getExploreStarNotifications(): Observable<ExploreStarNotificationDto> {
    return this.exploreStarNotificationsSubject.asObservable();
  }

  public getCivilizationMeetNotifications(): Observable<CivilizationMeetNotificationDto> {
    return this.civilizationMeetNotifications.asObservable();
  }
}
