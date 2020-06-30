import { PlanetInfoDto } from "./planet-info";
import { FleetInfoDto } from './fleet-info';
import { ColonyDto } from './colony-dto';

export interface ExploreStarNotificationDto {

	starId: string;
    planets: PlanetInfoDto[];

}