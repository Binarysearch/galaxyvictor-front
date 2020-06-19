import { Injectable } from '@angular/core';
import { CivilizationDetailDto } from '../../dto/civilization-detail';
import { Civilization } from '../../model/civilization';
import { Store } from './store';
import { ColonyManagerService } from './colony-manager.service';
import { FleetManagerService } from './fleet-manager.service';
import { EventService } from '../event.service';

@Injectable({
  providedIn: 'root'
})
export class CivilizationManagerService {

  constructor(
    private eventService: EventService,
    private store: Store,
    private fleetManager: FleetManagerService,
    private colonyManager: ColonyManagerService
  ) { }

  public setCivilization(civilizationDto: CivilizationDetailDto) {
    if (civilizationDto) {
      const civilization = new Civilization(civilizationDto.id, civilizationDto.name, true);
      
      this.store.addCivilization(civilization);
      
      civilization.homeworld = this.store.getPlanetById(civilizationDto.homeworldId);

      // Add colonies
      if (civilizationDto.colonies) {
        this.colonyManager.addColonies(civilizationDto.colonies);
      }

      //add fleets
      this.fleetManager.updateFleets(civilizationDto.fleets);
      
      this.store.setCivilization(civilization);
      
    } else {
      this.store.setCivilization(undefined);

      this.eventService.getCreateCivilizationEvents().subscribe(civilization => {
        this.setCivilization(civilization);
      });
    }
  }

}
