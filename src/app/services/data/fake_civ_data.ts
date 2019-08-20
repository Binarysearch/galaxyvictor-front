import { CivilizationDetail } from '../../dto/civilization-detail';
import { GalaxyDetail } from 'src/app/dto/galaxy-detail';

export const FAKE_CIVILIZATION_DATA: CivilizationDetail = {
    id: 'civ1',
    name: 'fake',
    capitolId: 'p1',
    fleets: [
        {
            id: 'f1',
            civilizationId: 'civ1',
            originId: 'ss1',
            destinationId: 'ss1',
            startTravelTime: 0,
            speed: 1,
            seed: 1,
            shipCount: 0
        },
        {
            id: 'f2',
            civilizationId: 'civ1',
            originId: 'ss2',
            destinationId: 'ss1',
            startTravelTime: new Date().getTime(),
            speed: 0.0001,
            seed: 2,
            shipCount: 0
        },
        {
            id: 'f3',
            civilizationId: 'civ1',
            originId: 'ss1',
            destinationId: 'ss2',
            startTravelTime: new Date().getTime(),
            speed: 0.00002,
            seed: 2,
            shipCount: 0
        }

    ],
    knownCivilizations: [],
    exploredStarSystems: [
        {
            id: 'ss1',
            x: 0,
            y: 0,
            type: 3,
            size: 2,
            planets:[
                { id: 'p1', type: 10, size: 3, orbit: 3, colony: { id: 'c1', civilizationId: 'civ1' } },
                { id: 'p2', type: 10, size: 5, orbit: 4, colony: null },
                { id: 'p3', type: 1, size: 1, orbit: 1, colony: null },
                { id: 'p4', type: 2, size: 2, orbit: 2, colony: null },
                { id: 'p5', type: 3, size: 4, orbit: 5, colony: null },
                { id: 'p6', type: 11, size: 5, orbit: 6, colony: null },
            ]
        },
        {
            id: 'ss2',
            x: 1,
            y: 0,
            type: 1,
            size: 5,
            planets:[
                { id: 'p3', type: 1, size: 1, orbit: 1, colony: null },
                { id: 'p4', type: 2, size: 2, orbit: 2, colony: null }
            ]
        },

    ]
}

export const FAKE_GALAXY_DATA: GalaxyDetail = {
    id: 'galaxyId',
    name: 'galaxyName',
    starSystems: [
        { id: 'ss1', x: 0, y: 0, type: 3, size: 2 },
        { id: 'ss2', x: 1, y: 0, type: 1, size: 5 },
    ],
    civilization: FAKE_CIVILIZATION_DATA
}