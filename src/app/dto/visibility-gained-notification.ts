import { FleetInfoDto } from './fleet-info';
import { ColonyInfoDto } from './colony-info';

export interface VisibilityGainedNotificationDto {

	starId: string;
    orbitingFleets: FleetInfoDto[];
    incomingFleets: FleetInfoDto[];
    colonies: ColonyInfoDto[];

}