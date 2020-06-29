import { TestBed } from '@angular/core/testing';

import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { registerLoginAndCreateCivilization } from '../login-utils';

import { ColoniesService } from './colonies.service';

describe('ColoniesService', () => {

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

  it('should get colonies when login', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const service: ColoniesService = TestBed.get(ColoniesService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getColonies().subscribe(
              colonies => {
                expect(colonies.size).toEqual(1);
                expect(Array.from(colonies)[0].id).toBeDefined();
                done();
              }
            );
          }
        }
      );
    });
  });
  
  it('should get colonies by id', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService: CivilizationsService = TestBed.get(CivilizationsService);
    const service: ColoniesService = TestBed.get(ColoniesService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getColonies().subscribe(
              colonies => {
                const cArray = Array.from(colonies);

                const colony = service.getColonyById(cArray[0].id);
                expect(colony.id).toEqual(cArray[0].id);
                expect(colony.civilization).toEqual(cArray[0].civilization);
                expect(colony.planet).toEqual(cArray[0].planet);

                expect(civilizationsService.getCivilizationById(colony.civilization.id).homeworldId).toEqual(colony.planet.id);
                done();
              }
            );
          }
        }
      );
    });
  });

});
