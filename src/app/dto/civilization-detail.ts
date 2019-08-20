import { FleetInfoDto } from './fleet-info';
import { ColonyInfoDto } from './colony-info';
import { CivilizationInfoDto } from './civilization-info';
import { StarSystemDetailDto } from './star-system-detail';

export interface CivilizationDetailDto extends CivilizationInfoDto {
    capitolId: string;
    fleets: FleetInfoDto[];
    colonies: ColonyInfoDto[];
    exploredStarSystems: StarSystemDetailDto[];
    knownCivilizations: CivilizationInfoDto[];
}