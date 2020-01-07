import { FleetInfoDto } from './fleet-info';
import { BuildingOrderDto } from './building-order';
import { ColonyInfoDto } from './colony-info';

export interface FinishBuildingShipEvent {

    fleet: FleetInfoDto;
    colony: ColonyInfoDto;
    
}