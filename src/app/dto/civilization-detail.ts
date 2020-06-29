import { FleetInfoDto } from './fleet-info';
import { CivilizationInfoDto } from './civilization-info';
import { StarSystemDetailDto } from './star-system-detail';
import { ColonyDto } from './colony-dto';

export interface CivilizationDetailDto extends CivilizationInfoDto {
    homeworldId: string;
    fleets: FleetInfoDto[];
    colonies: ColonyDto[];
    exploredStarSystems: StarSystemDetailDto[];
    knownCivilizations: CivilizationInfoDto[];
}