import { FleetInfoDto } from './fleet-info';
import { CivilizationInfoDto } from './civilization-info';
import { StarSystemDetailDto } from './star-system-detail';
import { ColonyInfoDto } from './colony-info';

export interface CivilizationDetailDto extends CivilizationInfoDto {
    homeworldId: string;
    fleets: FleetInfoDto[];
    colonies: ColonyInfoDto[];
    exploredStarSystems: StarSystemDetailDto[];
    knownCivilizations: CivilizationInfoDto[];
}