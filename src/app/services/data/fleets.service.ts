import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject, Subject } from 'rxjs';
import { Fleet } from '../../model/fleet';
import { StarsService } from './stars.service';
import { PirosApiService } from '@piros/api';
import { AuthService, AuthStatus } from '../auth.service';
import { CivilizationsService } from './civilizations.service';
import { FleetInfoDto } from '../../dto/fleet-info';
import { TimeService } from '../time.service';
import { subscribeToNotifications } from '../channel-utils';
import { StartTravelNotificationDto } from '../../dto/start-travel-notification';
import { EndTravelNotificationDto } from '../../dto/end-travel-notification';
import { DeleteFleetNotificationDto } from 'src/app/dto/delete-fleet-notification';

@Injectable({
  providedIn: 'root'
})
export class FleetsService {

  private fleetMap: Map<string, Fleet> = new Map();
  private fleets: BehaviorSubject<Set<Fleet>> = new BehaviorSubject(new Set());
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  private startTravelNotificationSubject: Subject<StartTravelNotificationDto> = new Subject();
  private endTravelNotificationSubject: Subject<EndTravelNotificationDto> = new Subject();
  private deleteFleetNotificationSubject: Subject<DeleteFleetNotificationDto> = new Subject();
  
  constructor(
    private starsService: StarsService,
    private api: PirosApiService,
    private authService: AuthService,
    private civilizationsService: CivilizationsService,
    private timeService: TimeService
  ) {
    
    this.authService.getStatus().subscribe(status => {
      if (status === AuthStatus.SESSION_STARTED) {
        this.civilizationsService.getCivilization().subscribe(civilization => {
          if (civilization) {
            this.api.request<FleetInfoDto[]>('get-fleets').subscribe(
              fleets => {
                this.addFleets(fleets.map(f => this.mapFleetInfoToFleet(f)));
                this.loaded.next(true);
              }
            );
          }
        });
      } else {
        this.fleets.next(new Set());
        this.loaded.next(false);
      }
    });

    subscribeToNotifications(this.api, 'start-travel-notifications', this.startTravelNotificationSubject);
    subscribeToNotifications(this.api, 'end-travel-notifications', this.endTravelNotificationSubject);
    subscribeToNotifications(this.api, 'delete-fleet-notifications', this.deleteFleetNotificationSubject);

    this.startTravelNotificationSubject.subscribe(notification => {
      this.updateFleet(notification.fleet);
    });
    this.endTravelNotificationSubject.subscribe(notification => {
      this.updateFleet(notification.fleet);
    });
    this.deleteFleetNotificationSubject.subscribe(notification => {
      this.removeFleetById(notification.fleetId);
    });

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

  public isLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }

  public getFleets(): Observable<Set<Fleet>> {
    return this.fleets.asObservable();
  }

  public getFleetById(id: string): Fleet {
    return this.fleetMap.get(id);
  }

  public startTravel(fleetId: string, originStarId: string, destinationStarId: string): Observable<boolean> {
    return this.api.request('start-travel', { fleetId: fleetId, originStarId: originStarId, destinationStarId: destinationStarId });
  }

  private removeFleetById(fleetId: string) {
    const fleet = this.getFleetById(fleetId);
    if (fleet) {
      this.removeFleet(fleet);
    };
  }

  private removeFleet(fleet: Fleet) {
    this.fleetMap.delete(fleet.id);
    this.fleets.value.delete(fleet);
    this.fleets.next(this.fleets.value);
    
    fleet.destination.incomingFleets.delete(fleet);
    fleet.destination.orbitingFleets.delete(fleet);
    fleet.origin.incomingFleets.delete(fleet);
    fleet.origin.orbitingFleets.delete(fleet);
    fleet.civilization.fleets.delete(fleet);
  }

  private updateFleet(fleetDto: FleetInfoDto): void {
    const existing = this.getFleetById(fleetDto.id);
    if (!existing) {
      this.addFleets([this.mapFleetInfoToFleet(fleetDto)]);
    } else {
      this.updateExistingFleet(existing, fleetDto);
    }
  }

  private updateExistingFleet(existing: Fleet, fleetDto: FleetInfoDto) {
    existing.origin.removeIncomingFleet(existing);
    existing.origin.removeOrbitingFleet(existing);
    existing.destination.removeIncomingFleet(existing);
    existing.destination.removeOrbitingFleet(existing);
    existing.civilization.removeFleet(existing);

    existing.origin = this.starsService.getStarById(fleetDto.originId);
    existing.destination = this.starsService.getStarById(fleetDto.destinationId);
    existing.civilization = this.civilizationsService.getCivilizationById(fleetDto.civilizationId);
    existing.startTravelTime = fleetDto.startTravelTime;
    existing.speed = fleetDto.speed;
    existing.seed = fleetDto.seed;

    if (fleetDto.destinationId === fleetDto.originId) {
      existing.origin.addOrbitingFleet(existing);
    } else {
      existing.destination.addIncomingFleet(existing);
    }
    existing.civilization.addFleet(existing);
    existing.sendChanges();
  }

  private addFleets(fleets: Fleet[]): void {
    fleets.forEach(fleet => {

      if (fleet.destination.id === fleet.origin.id) {
        fleet.origin.addOrbitingFleet(fleet);
      } else {
        fleet.destination.addIncomingFleet(fleet);
      }
      fleet.civilization.addFleet(fleet);

      this.fleetMap.set(fleet.id, fleet);
      this.fleets.value.add(fleet);
    });
    this.fleets.next(this.fleets.value);
  }

  private mapFleetInfoToFleet(fleetDto: FleetInfoDto) {
    const fleet = new Fleet(
      fleetDto.id,
      fleetDto.seed,
      fleetDto.speed,
      fleetDto.startTravelTime,
      this.starsService.getStarById(fleetDto.originId),
      this.starsService.getStarById(fleetDto.destinationId),
      this.civilizationsService.getCivilizationById(fleetDto.civilizationId),
      this.timeService
    );

    return fleet;
  }
}
