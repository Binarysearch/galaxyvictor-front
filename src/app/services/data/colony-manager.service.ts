import { Injectable } from '@angular/core';
import { ColonyInfoDto } from 'src/app/dto/colony-info';
import { Store } from './store';
import { Colony } from 'src/app/model/colony';

@Injectable({
  providedIn: 'root'
})
export class ColonyManagerService {

  constructor(
    private store: Store
  ) { }

  public addColony(colony: ColonyInfoDto) {
    this.addColonies([colony]);
  }

  public addColonies(colonyDtos: ColonyInfoDto[]) {        
    const colonies: Colony[] = colonyDtos.map(c => {
      const planet = this.store.getPlanetById(c.planet);
      const colony = new Colony(
        c.id,
        planet, 
        this.store.getCivilizationById(c.civilizationId)
      );
      planet.colony = colony;
      return colony;
    });
    this.store.addColonies(colonies);
  }

  public removeColony(colony: Colony) {
    this.store.removeColony(colony);
    colony.planet.colony = undefined;
  }

}
