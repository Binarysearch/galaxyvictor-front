import { FleetInfoDto } from './fleet-info';
import { ColonyInfoDto } from './colony-info';

export interface VisibilityGainedEvent {

	starSystem: string;
    orbitingFleets: FleetInfoDto[];
    incomingFleets: FleetInfoDto[];
    colonies: ColonyInfoDto[];

}