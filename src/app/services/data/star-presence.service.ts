import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { AuthStatus, AuthService } from '../auth.service';
import { PirosApiService } from '@piros/api';
import { CivilizationsService } from './civilizations.service';

@Injectable({
  providedIn: 'root'
})
export class StarPresenceService {

  private starsWithPresenceIds: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  private loaded: BehaviorSubject<boolean> = new BehaviorSubject(false);

  constructor(
    private api: PirosApiService,
    private authService: AuthService,
    private civilizationsService: CivilizationsService,
  ) {
    
    this.authService.getStatus().subscribe(status => {
      if (status === AuthStatus.SESSION_STARTED) {
        this.civilizationsService.getCivilization().subscribe(civilization => {
          if (civilization) {
            this.api.request<string[]>('get-stars-with-presence').subscribe(
              starIds => {
                const idSet: Set<string> = new Set();
                starIds.forEach(id => idSet.add(id));
                this.starsWithPresenceIds.next(idSet);
                this.loaded.next(true);
              }
            );
          }
        });
      } else {
        this.starsWithPresenceIds.next(new Set());
        this.loaded.next(false);
      }
    });
  }

  public isLoaded(): Observable<boolean> {
    return this.loaded.asObservable();
  }

  public getStarsWithPresence(): Observable<Set<string>> {
    return this.starsWithPresenceIds.asObservable();
  }

  public hasStarPresence(id: string): boolean {
    return this.starsWithPresenceIds.value.has(id);
  } 
}
