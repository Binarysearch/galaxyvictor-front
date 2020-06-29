import { FleetInfoDto } from './fleet-info';
import { BuildingOrderDto } from './building-order';
import { ColonyDto } from './colony-dto';

export interface FinishBuildingShipEvent {

    fleet: FleetInfoDto;
    colony: ColonyDto;
    
}