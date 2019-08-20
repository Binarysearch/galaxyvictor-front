import { FleetInfo } from './fleet-info';
import { CivilizationInfo } from './civilization-info';
import { StarSystemDetail } from './star-system-detail';

export interface CivilizationDetail extends CivilizationInfo {
    capitolId: string;
    fleets: FleetInfo[];
    exploredStarSystems: StarSystemDetail[];
    knownCivilizations: CivilizationInfo[];
}