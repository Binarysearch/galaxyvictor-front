import { FleetInfoDto } from './fleet-info';
import { CivilizationInfoDto } from './civilization-info';
import { StarSystemDetailDto } from './star-system-detail';

export interface CivilizationDetailDto extends CivilizationInfoDto {
    capitolId: string;
    fleets: FleetInfoDto[];
    exploredStarSystems: StarSystemDetailDto[];
    knownCivilizations: CivilizationInfoDto[];
}