import { TestBed } from '@angular/core/testing';

import { FleetsService } from './fleets.service';
import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { registerLoginAndCreateCivilization } from '../login-utils';

describe('FleetsService', () => {

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

  it('should get fleets when login', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const service: FleetsService = TestBed.get(FleetsService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getFleets().subscribe(
              fleets => {
                expect(fleets.size).toBeGreaterThan(0);
                expect(Array.from(fleets)[0].id).toBeDefined();
                done();
              }
            );
          }
        }
      );
    });
  });

  it('should get fleets by id', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const service: FleetsService = TestBed.get(FleetsService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getFleets().subscribe(
              fleets => {
                const fArray = Array.from(fleets);
                expect(fleets.size).toBeGreaterThan(0);
                expect(fArray[0].id).toBeDefined();
                const fleet = service.getFleetById(fArray[0].id);
                expect(fleet.id).toEqual(fArray[0].id);
                expect(fleet.destination).toEqual(fArray[0].destination);
                expect(fleet.origin).toEqual(fArray[0].origin);
                expect(fleet.civilization).toEqual(fArray[0].civilization);
                done();
              }
            );
          }
        }
      );
    });
  });

});
