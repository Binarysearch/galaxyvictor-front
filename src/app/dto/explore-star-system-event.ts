import { PlanetInfoDto } from "./planet-info";
import { FleetInfoDto } from './fleet-info';
import { ColonyInfoDto } from './colony-info';

export interface ExploreStarSystemEvent {

	starSystem: string;
    planets: PlanetInfoDto[];
    orbitingFleets: FleetInfoDto[];
    incomingFleets: FleetInfoDto[];
    colonies: ColonyInfoDto[];

}