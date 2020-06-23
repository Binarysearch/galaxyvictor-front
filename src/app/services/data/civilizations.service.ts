import { Injectable } from '@angular/core';
import { CivilizationDto } from '../../dto/civilization/civilization-dto';
import { Observable, BehaviorSubject } from 'rxjs';
import { PirosApiService } from '@piros/api';
import { AuthService, AuthStatus } from '../auth.service';
import { Civilization } from '../../model/civilization';

@Injectable({
  providedIn: 'root'
})
export class CivilizationsService {

  private civilizationMap: Map<string, Civilization> = new Map();
  private civilization: BehaviorSubject<Civilization> = new BehaviorSubject(null);
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);
  private unknownCivilization: Civilization = new Civilization('', 'Desconocida', false, null);

  constructor(
    private api: PirosApiService,
    private authService: AuthService
  ) {
    this.authService.getStatus().subscribe((status) => {
      if (status === AuthStatus.SESSION_STARTED) {
        this.api.request<CivilizationDto>('civilizations.get-civilization').subscribe(civ => {
          if (civ) {
            const civilization = new Civilization(civ.id, civ.name, true, civ.homeworld);
            this.civilizationMap.set(civilization.id, civilization);
            this.civilization.next(civilization);
          } else {
            this.civilization.next(null);
          }
          
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
  }

  public isLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }

  public getCivilization(): Observable<Civilization> {
    return this.civilization.asObservable();
  }

  public createCivilization(name: string): Observable<string> {
    return this.api.request<string>('create-civilization', name);
  }

  public getCivilizationById(id: string): Civilization {
    if (this.civilizationMap.has(id)) {
      return this.civilizationMap.get(id);
    } else {
      return this.unknownCivilization;
    }
  }
}
