import { BuildingOrderDto } from './building-order';

export interface ColonyInfoDto {
    
    id: string;
    civilizationId: string;
    planet: string;
    buildingOrder: BuildingOrderDto;

}