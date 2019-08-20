import { CivilizationDetail } from '../../dto/civilization-detail';
import { GalaxyDetail } from 'src/app/dto/galaxy-detail';

export const FAKE_CIVILIZATION_DATA: CivilizationDetail = {
    id: 'civ1',
    name: 'fake',
    capitolId: 'p1',
    fleets: [],
    knownCivilizations: [],
    exploredStarSystems: [
        {
            id: 'ss1',
            x: 0,
            y: 0,
            type: 3,
            size: 2,
            planets:[
                { id: 'p1', type: 10, size: 3, orbit: 3, colony: { id: 'c1', civilizationId: 'civ1' } }
            ]
        }
    ]
}

export const FAKE_GALAXY_DATA: GalaxyDetail = {
    id: 'galaxyId',
    name: 'galaxyName',
    starSystems: [
        { id: 'ss1', x: 0, y: 0, type: 3, size: 2 }
    ],
    civilization: FAKE_CIVILIZATION_DATA
}