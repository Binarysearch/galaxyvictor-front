import { FleetInfo } from './fleet-info';
import { ColonyInfo } from './colony-info';
import { CivilizationInfo } from './civilization-info';
import { StarSystemDetail } from './star-system-detail';

export interface CivilizationDetail extends CivilizationInfo {
    capitolId: string;
    fleets: FleetInfo[];
    colonies: ColonyInfo[];
    exploredStarSystems: StarSystemDetail[];
    knownCivilizations: CivilizationInfo[];
}