import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';
import { Fleet } from 'src/app/model/fleet';
import { StarsService } from './stars.service';
import { PirosApiService } from '@piros/api';
import { AuthService, AuthStatus } from '../auth.service';
import { CivilizationsService } from './civilizations.service';
import { FleetInfoDto } from '../../dto/fleet-info';
import { TimeService } from '../time.service';

@Injectable({
  providedIn: 'root'
})
export class FleetsService {

  private fleetMap: Map<string, Fleet> = new Map();
  private fleets: BehaviorSubject<Set<Fleet>> = new BehaviorSubject(new Set());
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

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

  private addFleets(fleets: Fleet[]): void {
    fleets.forEach(p => {
      this.fleetMap.set(p.id, p);
      this.fleets.value.add(p);
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
