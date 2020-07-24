import { Injectable } from '@angular/core';
import { CivilizationDto } from '../../dto/civilization/civilization-dto';
import { Observable, BehaviorSubject, forkJoin } from 'rxjs';
import { PirosApiService } from '@piros/api';
import { AuthService, AuthStatus } from '../auth.service';
import { Civilization } from '../../model/civilization';
import { NotificationService } from '../notification.service';
import { EnemyCivilizationDto } from 'src/app/dto/civilization/enemy-civilization-dto';

@Injectable({
  providedIn: 'root'
})
export class CivilizationsService {

  private civilizationMap: Map<string, Civilization> = new Map();
  private civilizations: BehaviorSubject<Set<Civilization>> = new BehaviorSubject(new Set());
  private civilization: BehaviorSubject<Civilization> = new BehaviorSubject(null);
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private api: PirosApiService,
    private authService: AuthService,
    private notificationService: NotificationService,
  ) {
    this.authService.getStatus().subscribe((status) => {
      if (status === AuthStatus.SESSION_STARTED) {
        forkJoin(
          this.api.request<CivilizationDto>('civilizations.get-civilization'),
          this.api.request<EnemyCivilizationDto[]>('civilizations.get-known-civilizations')
        ).subscribe(results => {
          const civ = results[0];
          const knownCivs = results[1];
          const civilizations = new Set(knownCivs.map(c => new Civilization(c.id, c.name, false, null)));

          civilizations.forEach(c => {
            this.civilizationMap.set(c.id, c);
          });

          if (civ) {
            const civilization = new Civilization(civ.id, civ.name, true, civ.homeworld);
            this.civilizationMap.set(civilization.id, civilization);
            this.civilization.next(civilization);
            civilizations.add(civilization);
          } else {
            this.civilization.next(null);
          }
          
          this.civilizations.next(civilizations);

          this.loaded.next(true);
        }, (err) => {
          console.log(err);
        });

        this.api.connectToChannel<CivilizationDto>('create-civilization').subscribe((channelConnection) => {
          channelConnection.messages.subscribe(civ => {
            const civilization = new Civilization(civ.id, civ.name, true, civ.homeworld);
            this.civilizationMap.set(civilization.id, civilization);
            this.civilization.next(civilization);
          });
        });

      } else {
        this.civilization.next(null);
        this.loaded.next(false);
        this.civilizationMap.clear();
      }
    });
    
    this.notificationService.getCivilizationMeetNotifications().subscribe(notification => {
      notification.civilizations.forEach(civilizationDto => {
        if (this.civilizationMap.has(civilizationDto.id)) {
          const civilization = this.civilizationMap.get(civilizationDto.id);
          civilization.name = civilizationDto.name;
        } else {
          const civilization = new Civilization(civilizationDto.id, civilizationDto.name, false, null);
          this.civilizationMap.set(civilization.id, civilization);
          this.civilizations.value.add(civilization);
        }
      });
      
      this.civilizations.next(this.civilizations.value);
    });
  }

  public isLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }

  public getCivilization(): Observable<Civilization> {
    return this.civilization.asObservable();
  }

  public getCivilizations(): Observable<Set<Civilization>> {
    return this.civilizations.asObservable();
  }

  public createCivilization(name: string): Observable<string> {
    return this.api.request<string>('create-civilization', name);
  }

  public getCivilizationById(id: string): Civilization {
    if (this.civilizationMap.has(id)) {
      return this.civilizationMap.get(id);
    } else {
      const civilization: Civilization = new Civilization(id, 'Desconocida', false, null);
      this.civilizationMap.set(civilization.id, civilization);
      this.civilizations.value.add(civilization);
      this.civilizations.next(this.civilizations.value);
      return civilization;
    }
  }
}
