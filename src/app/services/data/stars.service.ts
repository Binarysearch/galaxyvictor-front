import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { StarSystem, StarType, StarSize } from 'src/app/model/star-system';
import { GvApiService } from '../gv-api.service';
import { STAR_TYPES, STAR_SIZES } from 'src/app/galaxy-constants';
import { Status } from 'src/app/model/gv-api-service-status';

@Injectable({
  providedIn: 'root'
})
export class StarsService {

  public static unknownStarSystem: StarSystem = new StarSystem('', 'Desconocido', 0, 0, STAR_SIZES[0], STAR_TYPES[0]);
  
  private starsMap: Map<string, StarSystem> = new Map();

  private stars: BehaviorSubject<StarSystem[]> = new BehaviorSubject([]);

  constructor(
    private api: GvApiService
  ) {
    this.api.getStatus().subscribe((status) => {
      if (status.sessionStarted === Status.SESSION_STARTED) {
        this.api.getStars().subscribe(stars => {
          const starSystems: StarSystem[] = stars.map(
            ss => new StarSystem(
              ss.id, 
              ss.name, 
              ss.x, 
              ss.y, 
              this.getStarSizeById(ss.size), 
              this.getStarTypeById(ss.type)
            )
          );
          this.setStarSystems(starSystems);
        }, (err) => {
          console.log(err);
        });
      } else {
        this.stars.next([]);
      }
    });
  }

  public getStars(): Observable<StarSystem[]> {
    return this.stars.asObservable();
  }
  
  public getStarTypeById(type: number): StarType {
    return STAR_TYPES[type - 1];
  }
  
  public getStarSizeById(size: number): StarSize {
    return STAR_SIZES[size - 1];
  }

  public getStarById(id: string): StarSystem {
    if (this.starsMap.has(id)) {
      return this.starsMap.get(id);
    } else {
      return StarsService.unknownStarSystem;
    }
  }

  private setStarSystems(starSystems: StarSystem[]): void {
    this.starsMap.clear();
    starSystems.forEach(ss => this.starsMap.set(ss.id, ss));
    this.stars.next(starSystems);
  }
}
