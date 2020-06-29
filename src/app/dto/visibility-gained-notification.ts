import { FleetInfoDto } from './fleet-info';
import { ColonyDto } from './colony-dto';

export interface VisibilityGainedNotificationDto {

	starId: string;
    orbitingFleets: FleetInfoDto[];
    incomingFleets: FleetInfoDto[];
    colonies: ColonyDto[];

}