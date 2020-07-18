import { FleetInfoDto } from './fleet-info';
import { ShipDto } from './ship-dto';

export interface CreateShipNotificationDto {

    fleet: FleetInfoDto;
    ship: ShipDto;
     
}