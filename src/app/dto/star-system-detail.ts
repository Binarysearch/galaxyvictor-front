import { PlanetInfo } from './planet-info';
import { StarSystemInfo } from './star-system-info';

export interface StarSystemDetail extends StarSystemInfo {
    planets: PlanetInfo[];
}