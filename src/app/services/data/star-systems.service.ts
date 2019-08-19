import { Injectable } from '@angular/core';
import { ApiService } from '../api.service';
import { Observable, BehaviorSubject } from 'rxjs';
import { StarSystem } from '../../model/star-system.interface';
import { Store } from './store';

export interface StarSystemListDto {
  total: number;
  starSystems: StarSystem[];
}

@Injectable({
  providedIn: 'root'
})
export class StarSystemsService {


  constructor(private api: ApiService, private store: Store) {
    this.api.getReady().subscribe(ready => {
      if (ready) {
        this.api.request<StarSystemListDto>('get-star-systems', 'test-galaxy')
          .subscribe(ss => this.store.setStarSystems(ss.starSystems));
      }
    });
  }

  public getStarSystems(): Observable<StarSystem[]> {
    return this.store.getStarSystems();
  }

}
