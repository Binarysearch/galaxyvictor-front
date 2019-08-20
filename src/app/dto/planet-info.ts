import { ColonyInfo } from './colony-info';

export interface PlanetInfo {
    id: string;
    type: number;
    size: number;
    orbit: number;
    colony: ColonyInfo;
}