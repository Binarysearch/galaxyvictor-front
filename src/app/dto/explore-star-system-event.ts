import { PlanetInfoDto } from "./planet-info";
import { FleetInfoDto } from './fleet-info';
import { ColonyDto } from './colony-dto';

export interface ExploreStarSystemEvent {

	starSystem: string;
    planets: PlanetInfoDto[];
    orbitingFleets: FleetInfoDto[];
    incomingFleets: FleetInfoDto[];
    colonies: ColonyDto[];

}