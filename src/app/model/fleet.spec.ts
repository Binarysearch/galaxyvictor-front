import { Fleet } from './fleet';
import { TimeService } from '../services/time.service';
import { StarSystem } from './star-system';

describe('Fleet', () => {
    let timeServiceSpy: jasmine.SpyObj<TimeService> = jasmine.createSpyObj('TimeService', ['getGameTime']);
    let ss1: StarSystem = { id: 'ss1', x: 0, y: 0, type: 3, size: 2 };
    let ss2: StarSystem = { id: 'ss2', x: 100, y: 100, type: 3, size: 2 };
    
    it('should create an instance', () => {
        expect(new Fleet(
            '',
            1,
            1,
            0,
            ss1,
            ss1,
            timeServiceSpy
        )).toBeTruthy();
    });

    it('not travelling', () => {
        const fleet = new Fleet(
            '',
            1,
            1,
            0,
            ss1,
            ss1,
            timeServiceSpy
        );

        
        expect(fleet.x).toBeDefined();
        expect(fleet.y).toBeDefined();
    });

    it('travelling', () => {
        const fleet = new Fleet(
            '',
            1,
            0.01,
            1,
            ss1,
            ss2,
            timeServiceSpy
        );

        timeServiceSpy.getGameTime.and.returnValue(2);

        expect(fleet.x).toBeDefined();
        expect(fleet.y).toBeDefined();
        expect(fleet.isTravelling).toBeTruthy();
    });

});
