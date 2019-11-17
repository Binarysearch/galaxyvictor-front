import { GalaxyInfoDto } from './galaxy-info';
import { StarSystemInfoDto } from './star-system-info';
import { CivilizationDetailDto } from './civilization-detail';

export interface GalaxyDetailDto extends GalaxyInfoDto {
    starSystems: StarSystemInfoDto[];
    civilization: CivilizationDetailDto;
}