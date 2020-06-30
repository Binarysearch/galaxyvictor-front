import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, forkJoin } from 'rxjs';
import { AuthStatus, AuthService } from '../auth.service';
import { PirosApiService } from '@piros/api';
import { CivilizationsService } from './civilizations.service';

@Injectable({
  providedIn: 'root'
})
export class StarPresenceService {

  private starsWithPresenceIds: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
  private exploredStars: BehaviorSubject<Set<string>> = new BehaviorSubject(new Set());
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
            forkJoin(
              this.api.request<string[]>('get-stars-with-presence'),
              this.api.request<string[]>('get-explored-stars')
            ).subscribe(
              results => {
                const starIds = results[0];
                const starIdSet: Set<string> = new Set();
                starIds.forEach(id => starIdSet.add(id));
                this.starsWithPresenceIds.next(starIdSet);

                const exploredStars = results[1];
                const exploredStarIdSet: Set<string> = new Set();
                exploredStars.forEach(id => exploredStarIdSet.add(id));
                this.exploredStars.next(exploredStarIdSet);

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

  public getExploredStars(): Observable<Set<string>> {
    return this.exploredStars.asObservable();
  }

  public isStarExplored(id: string): boolean {
    return this.exploredStars.value.has(id);
  } 

  public getStarsWithPresence(): Observable<Set<string>> {
    return this.starsWithPresenceIds.asObservable();
  }

  public hasStarPresence(id: string): boolean {
    return this.starsWithPresenceIds.value.has(id);
  } 
}
