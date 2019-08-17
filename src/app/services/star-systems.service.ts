import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { StarSystem } from '../model/star-system.interface';

export interface StarSystemListDto {
  total: number;
  starSystems: StarSystem[];
}

@Injectable({
  providedIn: 'root'
})
export class StarSystemsService {

  private starSystemsSubject: BehaviorSubject<StarSystem[]> = new BehaviorSubject<StarSystem[]>([]);

  constructor(private api: ApiService) {
    this.api.getReady().subscribe(ready => {
      if (ready) {
        //this.api.request<StarSystemListDto>('get-star-systems', '')
          //.subscribe(ss => this.starSystemsSubject.next(ss.starSystems));
          this.starSystemsSubject.next([{x:0,y:0,type:2,size:5}]);
      } else {
        this.starSystemsSubject.next([]);
      }
    });
  }

  public getStarSystems(): Observable<StarSystem[]> {
    return this.starSystemsSubject.asObservable();
  }

}
