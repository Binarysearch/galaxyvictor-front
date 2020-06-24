import { TestBed } from '@angular/core/testing';

import { FleetsService } from './fleets.service';
import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { registerLoginAndCreateCivilization } from '../login-utils';
import { Fleet } from '../../model/fleet';
import { StarsService } from './stars.service';
import { forkJoin } from 'rxjs';
import { first } from 'rxjs/operators';
import { StarSystem } from '../../model/star-system';

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

                expect(fleet.destination.hasAlliedFleets).toBeTruthy();
                expect(fleet.origin.hasAlliedFleets).toBeTruthy();
                expect(fleet.origin.orbitingFleets.size).toEqual(1);
                expect(fleet.origin).toEqual(fleet.destination);
                expect(fleet.civilization.fleets.size).toEqual(1);
                expect(fleet.isTravelling).toEqual(false);

                done();
              }
            );
          }
        }
      );
    });
  });

  it('should start travel', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const starsService: StarsService = TestBed.get(StarsService);

    let travelStartSent = false;
    let travelStartReceived = false;

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      forkJoin(
        fleetsService.isLoaded().pipe(first(l => l)),
        starsService.isLoaded().pipe(first(l => l))
      ).subscribe(
        results => {
          if (!travelStartSent) {
            fleetsService.getFleets().subscribe(
              fleets => {
                const fleet: Fleet = fleets.values().next().value;
                const origin: StarSystem = fleet.origin;
                starsService.getStars().subscribe(stars => {
                  const star: StarSystem = stars[Math.floor(Math.random() * stars.length)];
                  
                  fleetsService.startTravel(fleet.id, fleet.destination.id, star.id).subscribe(result => {
                    expect(result).toBeTruthy();
                  });

                  travelStartSent = true;

                  fleet.getChanges().subscribe(() => {
                    if (!travelStartReceived) {
                      travelStartReceived = true;
                      expect(fleet.destination.id).toEqual(star.id);
                      expect(fleet.origin.incomingFleets.has(fleet)).toBeFalsy();
                      expect(fleet.origin.orbitingFleets.has(fleet)).toBeFalsy();
                      expect(fleet.destination.incomingFleets.has(fleet)).toBeTruthy();
                      expect(fleet.isTravelling).toBeTruthy();
                    } else {
                      expect(fleet.destination.id).toEqual(star.id);
                      expect(fleet.origin.id).toEqual(star.id);
                      expect(fleet.destination.incomingFleets.has(fleet)).toBeFalsy();
                      expect(fleet.destination.orbitingFleets.has(fleet)).toBeTruthy();
                      expect(origin.orbitingFleets.has(fleet)).toBeFalsy();
                      expect(origin.incomingFleets.has(fleet)).toBeFalsy();
                      expect(fleet.isTravelling).toBeFalsy();
                      done();
                    }
                  });
                });
              }
            );
          }
        }
      );
    });
  });

});
