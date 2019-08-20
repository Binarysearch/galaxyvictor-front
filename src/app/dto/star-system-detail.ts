import { PlanetInfoDto } from './planet-info';
import { StarSystemInfoDto } from './star-system-info';

export interface StarSystemDetailDto extends StarSystemInfoDto {
    planets: PlanetInfoDto[];
}