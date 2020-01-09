import { Injectable } from '@angular/core';
import { ColonyInfoDto } from 'src/app/dto/colony-info';
import { Store } from './store';
import { Colony } from 'src/app/model/colony';
import { BuildingOrder } from 'src/app/model/building-order';

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
        this.store.getCivilizationById(c.civilizationId),
        c.buildingOrder ? new BuildingOrder(c.buildingOrder.id) : null
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

  public updateColony(colonyDto: ColonyInfoDto): void {
    const existing = this.store.getColonyById(colonyDto.id);
    if (!existing) {
      this.addColony(colonyDto);
    } else {
      this.updateExistingColony(existing, colonyDto);
    }
  }

  
  private updateExistingColony(existing: Colony, colonyDto: ColonyInfoDto) {
    existing.civilization = this.store.getCivilizationById(colonyDto.civilizationId);

    existing.buildingOrder = (colonyDto.buildingOrder) ? new BuildingOrder(colonyDto.buildingOrder.id) : null;
    
    existing.sendChanges();
  }
}