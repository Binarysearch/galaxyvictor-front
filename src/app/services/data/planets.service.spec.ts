import { TestBed } from '@angular/core/testing';

import { PlanetsService } from './planets.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../local-storage.service';
import { GvApiService } from '../gv-api.service';
import { loginWithCivilization } from '../login-utils';

describe('PlanetsService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: PIROS_API_SERVICE_CONFIG, useValue: config }
      ]
    });

    const localStorageService: LocalStorageService = TestBed.get(LocalStorageService);
    localStorageService.deleteSavedToken();
    
  });

  it('should get planets when login', (done) => {
    const apiService = TestBed.get(GvApiService);
    const service: PlanetsService = TestBed.get(PlanetsService);

    loginWithCivilization(apiService, () => {
      service.getPlanets().subscribe(
        planets => {
          expect(Array.from(planets)[0]).toBeDefined();
          expect(Array.from(planets)[0].id).toBeDefined();
          done();
        }
      );
    });
  });

  it('should get planets by id', (done) => {
    const apiService = TestBed.get(GvApiService);
    const service: PlanetsService = TestBed.get(PlanetsService);
    
    loginWithCivilization(apiService, () => {
      service.getPlanets().subscribe(
        planets => {
          const pArray = Array.from(planets);
          expect(pArray[0]).toBeDefined();
          expect(pArray[0].id).toBeDefined();
          const planet = service.getPlanetById(pArray[0].id);
          expect(planet.id).toEqual(pArray[0].id);
          expect(planet.size).toEqual(pArray[0].size);
          expect(planet.type).toEqual(pArray[0].type);
          done();
        }
      );
    });
  });
});
