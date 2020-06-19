import { Injectable } from '@angular/core';
import { ApiService } from '@piros/api';
import { VisibilityLostEvent } from '../dto/visibility-lost-event';
import { Subject, Observable } from 'rxjs';
import { VisibilityGainedEvent } from '../dto/visibility-gained-event';
import { UpdateFleetEvent } from '../dto/update-fleet-event';
import { StartTravelEvent } from '../dto/start-travel-event';
import { FinishBuildingShipEvent } from '../dto/finish-building-ship-event';
import { ExploreStarSystemEvent } from '../dto/explore-star-system-event';
import { EndTravelEvent } from '../dto/end-travel-event';
import { DeleteFleetEvent } from '../dto/delete-fleet-event';
import { CreateBuildingOrderEvent } from '../dto/create-building-order-event';
import { ColonizePlanetEvent } from '../dto/colonize-planet-event';
import { CivilizationDetailDto } from '../dto/civilization-detail';

@Injectable({
  providedIn: 'root'
})
export class EventService {
  
  private subjects: Map<string, Subject<any>> = new Map();

  constructor(
    private api: ApiService
  ) {
    /*this.api.isReady().subscribe(
      ready => {
        if (ready) {
          [
            'visibility-lost-events',
            'visibility-gained-events',
            'update-fleet-events',
            'start-travel-events',
            'finish-building-ship-events',
            'explore-star-system-events',
            'end-travel-events',
            'delete-fleet-events',
            'create-building-order-events',
            'colonize-planet-events',
            'create-civilization'
          ].forEach(channel => this.subscribeAndRedirectEvents(channel));
        }
      }
    );*/
  }

  public getVisibilityLostEvents(): Observable<VisibilityLostEvent> {
    return this.getSubject('visibility-lost-events').asObservable();
  }

  public getVisibilityGainedEvents(): Observable<VisibilityGainedEvent> {
    return this.getSubject('visibility-gained-events').asObservable();
  }

  public getUpdateFleetEvents(): Observable<UpdateFleetEvent> {
    return this.getSubject('update-fleet-events').asObservable();
  }

  public getStartTravelEvents(): Observable<StartTravelEvent> {
    return this.getSubject('start-travel-events').asObservable();
  }

  public getFinishBuildingShipEvents(): Observable<FinishBuildingShipEvent> {
    return this.getSubject('finish-building-ship-events').asObservable();
  }

  public getExploreStarSystemEvents(): Observable<ExploreStarSystemEvent> {
    return this.getSubject('explore-star-system-events').asObservable();
  }

  public getEndTravelEvents(): Observable<EndTravelEvent> {
    return this.getSubject('end-travel-events').asObservable();
  }

  public getDeleteFleetEvents(): Observable<DeleteFleetEvent> {
    return this.getSubject('delete-fleet-events').asObservable();
  }

  public getCreateBuildingOrderEvents(): Observable<CreateBuildingOrderEvent> {
    return this.getSubject('create-building-order-events').asObservable();
  }

  public getColonizePlanetEvents(): Observable<ColonizePlanetEvent> {
    return this.getSubject('colonize-planet-events').asObservable();
  }

  public getCreateCivilizationEvents(): Observable<CivilizationDetailDto> {
    return this.getSubject('create-civilization').asObservable();
  }

  private subscribeAndRedirectEvents(channel: string) {
    this.api.connectToChannel<ExploreStarSystemEvent>(channel)
    .observable.subscribe(event => {
      this.getSubject(channel).next(event);
    });
  }

  private getSubject(channel: string): Subject<any> {
    let subject = this.subjects.get(channel);
    if (!subject) {
      subject = new Subject();
      this.subjects.set(channel, subject);
    }
    return subject;
  }
}
