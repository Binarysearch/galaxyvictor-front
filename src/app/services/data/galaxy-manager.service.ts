import { Injectable } from '@angular/core';
import { ApiService } from '@piros/api';
import { GalaxyDetailDto } from '../../dto/galaxy-detail';
import { StarSystem } from '../../model/star-system';
import { CivilizationManagerService } from './civilization-manager.service';
import { Store } from './store';
import { StarSystemInfoDto } from '../../dto/star-system-info';

@Injectable({
  providedIn: 'root'
})
export class GalaxyManagerService {

  constructor(
    private api: ApiService,
    private civilizationManager: CivilizationManagerService,
    private store: Store
  ) {
    this.api.isReady()
    .subscribe(ready => {
      if (ready) {
        this.api.request<GalaxyDetailDto>('get-galaxy', 'test-galaxy')
          .subscribe(galaxy => {
            this.setStarSystems(galaxy.starSystems);
            this.civilizationManager.setCivilization(galaxy.civilization);
          });
      }
    });
  }
  
  private setStarSystems(starSystemDtos: StarSystemInfoDto[]) {
    const starSystems: StarSystem[] = starSystemDtos.map(
      ss => new StarSystem(ss.id, ss.name, ss.x, ss.y, this.store.getStarSizeById(ss.size), this.store.getStarTypeById(ss.type))
    );
    this.store.setStarSystems(starSystems);
  }
}
