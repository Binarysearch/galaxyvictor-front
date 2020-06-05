import { Injectable } from '@angular/core';
import { StarSystem } from '../../model/star-system';
import { CivilizationManagerService } from './civilization-manager.service';
import { Store } from './store';
import { StarSystemInfoDto } from '../../dto/star-system-info';
import { GvApiService } from '../gv-api.service';

@Injectable({
  providedIn: 'root'
})
export class GalaxyManagerService {

  constructor(
    private api: GvApiService,
    private civilizationManager: CivilizationManagerService,
    private store: Store
  ) {
    this.api.isReady()
    .subscribe(ready => {
      if (ready) {
        this.api.getGalaxy()
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
