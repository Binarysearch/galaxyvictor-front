import { FleetInfoDto } from './fleet-info';
import { ShipDto } from './ship-dto';

export interface FleetDetailDto extends FleetInfoDto {

    ships: ShipDto[];

}