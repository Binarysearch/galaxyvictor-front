import { Injectable } from '@angular/core';
import { CivilizationDetailDto } from '../../dto/civilization-detail';
import { Civilization } from '../../model/civilization';
import { Store } from './store';
import { PlanetManagerService } from './planet-manager.service';
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
    private planetManager: PlanetManagerService,
    private fleetManager: FleetManagerService,
    private colonyManager: ColonyManagerService
  ) { }

  public setCivilization(civilizationDto: CivilizationDetailDto) {
    if (civilizationDto) {
      const civilization = new Civilization(civilizationDto.id, civilizationDto.name, true);
      
      this.store.addCivilization(civilization);
      
      //Add planets
      if (civilizationDto.exploredStarSystems.length > 0) {
        civilizationDto.exploredStarSystems.forEach(
          ss => {
            if (ss.planets) {
              this.planetManager.addPlanets(ss.planets);
            }
          }
        );
      }
      
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
