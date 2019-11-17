import { ColonyInfoDto } from './colony-info';

export interface PlanetInfoDto {
    id: string;
    type: number;
    size: number;
    orbit: number;
    colony: ColonyInfoDto;
}