import { Injectable } from '@angular/core';
import { Colony } from 'src/app/model/colony';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStatus, AuthService } from '../auth.service';
import { PirosApiService } from '@piros/api';
import { CivilizationsService } from './civilizations.service';
import { ColonyDto } from '../../dto/colony-dto';
import { PlanetsService } from './planets.service';
import { NotificationService } from '../notification.service';

let i = 1;

@Injectable({
  providedIn: 'root'
})
export class ColoniesService {

  private coloniesMap: Map<string, Colony> = new Map();
  private colonies: BehaviorSubject<Set<Colony>> = new BehaviorSubject(new Set());
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  public instance: number = i++;
  
  constructor(
    private api: PirosApiService,
    private authService: AuthService,
    private civilizationsService: CivilizationsService,
    private planetsService: PlanetsService,
    private notificationService: NotificationService
  ) {
    
    this.authService.getStatus().subscribe(status => {
      
      if (status === AuthStatus.SESSION_STARTED) {
        this.planetsService.isLoaded().subscribe(loaded => {
          if (loaded) {
            this.api.request<ColonyDto[]>('get-visible-colonies').subscribe(
              colonies => {
                this.addColonies(colonies.map(c => this.mapColonyDtoToColony(c)));
                this.loaded.next(true);
              }
            );
          }
        });
      } else {
        this.colonies.next(new Set());
        this.loaded.next(false);
      }
    });

    this.notificationService.getVisibilityGainNotification().subscribe(notificaton => {
      if (notificaton.colonies.length > 0) {
        this.addColonies(notificaton.colonies.map(c => this.mapColonyDtoToColony(c)));
      }
    });

    this.notificationService.getVisibilityLostNotification().subscribe(notificaton => {
      const colonies: Set<Colony> = new Set();

      this.colonies.value.forEach(c => {
        if (c.planet.starSystem.id !== notificaton.starId) {
          colonies.add(c);
        } else {
          this.coloniesMap.delete(c.id);
        }
      });

      this.colonies.next(colonies);
    });

    this.notificationService.getCreateColonyNotification().subscribe(notification => {
      this.addColonies([this.mapColonyDtoToColony(notification)]);
    });

  }

  public isLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }

  public getColonies(): Observable<Set<Colony>> {
    return this.colonies.asObservable();
  }

  public getColonyById(id: string): Colony {
    return this.coloniesMap.get(id);
  }

  public createColony(planetId: string): Observable<boolean> {
    return this.api.request<boolean>('create-colony', planetId);
  }

  private addColonies(colonies: Colony[]): void {
    colonies.forEach(c => {

      const existingColony = this.coloniesMap.get(c.id);
      if (existingColony) {
        this.coloniesMap.delete(c.id);
        this.colonies.value.delete(existingColony);
      }

      this.coloniesMap.set(c.id, c);
      this.colonies.value.add(c);

      c.planet.colony = c;
    });
    this.colonies.next(this.colonies.value);
  }

  private mapColonyDtoToColony(dto: ColonyDto): Colony {
    return new Colony(
      dto.id,
      this.planetsService.getPlanetById(dto.planet),
      this.civilizationsService.getCivilizationById(dto.civilization),
      null
    );
  }

}
