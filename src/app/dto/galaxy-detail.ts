import { GalaxyInfo } from './galaxy-info';
import { StarSystemInfo } from './star-system-info';
import { CivilizationDetail } from './civilization-detail';

export interface GalaxyDetail extends GalaxyInfo {
    starSystems: StarSystemInfo[];
    civilization: CivilizationDetail;
}