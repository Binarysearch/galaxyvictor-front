import { TestBed } from '@angular/core/testing';

import { MapEntitiesService } from './map-entities.service';
import { StarsService } from './stars.service';
import { of } from 'rxjs';
import { PlanetsService } from './planets.service';

describe('MapEntitiesService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        {
          provide: StarsService, useValue: {
            getStars: () => {
              return of([{ id: 'starId' }]);
            }
          }
        },
        {
          provide: PlanetsService, useValue: {
            getPlanets: () => {
              return of([{ id: 'planetId' }]);
            }
          }
        }
      ]
    });
  });

  it('should add stars as entities', (done) => {
    const service: MapEntitiesService = TestBed.inject(MapEntitiesService);

    const entity = service.getEntity('starId');

    setTimeout(() => {
      expect(entity).toBeDefined();
      expect(entity.id).toEqual('starId');
      done();
    }, 10);

  });

  it('should add planets as entities', (done) => {
    const service: MapEntitiesService = TestBed.inject(MapEntitiesService);

    const entity = service.getEntity('planetId');

    setTimeout(() => {
      expect(entity).toBeDefined();
      expect(entity.id).toEqual('planetId');
      done();
    }, 10);

  });
});
