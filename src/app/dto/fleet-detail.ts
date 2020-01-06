import { FleetInfoDto } from './fleet-info';
import { ShipInfoDto } from './ship-info';

export interface FleetDetailDto extends FleetInfoDto {

    ships: ShipInfoDto[];

}