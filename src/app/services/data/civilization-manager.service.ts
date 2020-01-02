import { Injectable } from '@angular/core';
import { CivilizationDetailDto } from '../../dto/civilization-detail';
import { Civilization } from '../../model/civilization';
import { Store } from './store';
import { PlanetManagerService } from './planet-manager.service';
import { ColonyManagerService } from './colony-manager.service';
import { ChannelConnection, ApiService } from '@piros/api';
import { FleetManagerService } from './fleet-manager.service';

@Injectable({
  providedIn: 'root'
})
export class CivilizationManagerService {

  constructor(
    private api: ApiService,
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
          ss => this.planetManager.addPlanets(ss.planets)
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

      const createCivilizationChannel: ChannelConnection<CivilizationDetailDto> = this.api.connectToChannel<CivilizationDetailDto>('create-civilization');
      createCivilizationChannel.observable.subscribe(civilization => {
        this.setCivilization(civilization);
        createCivilizationChannel.disconnect();
      });
    }
  }

}
