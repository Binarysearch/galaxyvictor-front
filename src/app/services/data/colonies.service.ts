import { Injectable } from '@angular/core';
import { Colony } from 'src/app/model/colony';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { AuthStatus, AuthService } from '../auth.service';
import { PirosApiService } from '@piros/api';
import { CivilizationsService } from './civilizations.service';
import { ColonyDto } from '../../dto/colony-dto';
import { PlanetsService } from './planets.service';
import { NotificationService } from '../notification.service';
import { BuildingOrder } from '../../model/building-order';
import { BuildingOrderDto } from 'src/app/dto/building-order-dto';

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
            forkJoin(
              this.api.request<ColonyDto[]>('get-visible-colonies'),
              this.api.request<BuildingOrderDto[]>('get-building-orders'),
            ).subscribe(
              results => {
                const colonies = results[0];
                const buildingOrders = results[1];
                
                this.addColonies(colonies.map(c => this.mapColonyDtoToColony(c)));
                this.addBuildingOrders(buildingOrders.map(bo => this.mapBuildingOrder(bo)));
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
          this.deleteColony(c);
        }
      });

      this.colonies.next(colonies);
    });

    this.notificationService.getCreateColonyNotification().subscribe(notification => {
      this.addColonies([this.mapColonyDtoToColony(notification)]);
    });

    this.notificationService.getBuildingOrdersNotification().subscribe(notification => {
      notification.buildingOrders.forEach(bo => {

        const colony = this.coloniesMap.get(bo.colonyId);

        const buildingOrder = new BuildingOrder(
          bo.id,
          colony,
          bo.type,
          bo.endTime,
          bo.startedTime
        );

        colony.buildingOrders.push(buildingOrder);
        colony.sendChanges();
      });

      notification.finishedBuildingOrders.forEach(fbo => {
        const colony = this.coloniesMap.get(fbo.colonyId);
        colony.buildingOrders = colony.buildingOrders.filter(b => b.id !== fbo.id);
        colony.sendChanges();
      });
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
        this.deleteColony(existingColony);
      }

      this.coloniesMap.set(c.id, c);
      this.colonies.value.add(c);

      c.planet.colony = c;
    });
    this.colonies.next(this.colonies.value);
  }

  private addBuildingOrders(buildingOrders: BuildingOrder[]): void {
    buildingOrders.forEach(bo => {
      bo.colony.buildingOrders.push(bo);
    });
  }

  private deleteColony(c: Colony) {
    c.planet.colony = null;
    this.coloniesMap.delete(c.id);
    this.colonies.value.delete(c);
  }

  private mapColonyDtoToColony(dto: ColonyDto): Colony {
    return new Colony(
      dto.id,
      this.planetsService.getPlanetById(dto.planet),
      this.civilizationsService.getCivilizationById(dto.civilization)
    );
  }

  private mapBuildingOrder(bo: BuildingOrderDto): BuildingOrder {
    return new BuildingOrder(
      bo.id,
      this.coloniesMap.get(bo.colonyId),
      bo.type,
      bo.endTime,
      bo.startedTime
    );
  }

}
