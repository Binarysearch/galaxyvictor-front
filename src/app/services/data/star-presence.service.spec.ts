import { TestBed } from '@angular/core/testing';

import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { registerLoginAndCreateCivilization } from '../login-utils';
import { StarsService } from './stars.service';

import { StarPresenceService } from './star-presence.service';

describe('StarPresenceService', () => {

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

  it('should get stars with presence when login', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const starsService: StarsService = TestBed.get(StarsService);
    const service: StarPresenceService = TestBed.get(StarPresenceService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getStarsWithPresence().subscribe(
              starIds => {
                expect(starIds.size).toEqual(1);
                const arr = Array.from(starIds);
                const id = arr[0];
                const star = starsService.getStarById(id);
                expect(star.id).toEqual(id);

                expect(service.hasStarPresence(id)).toBeTruthy();
                done();
              }
            );
          }
        }
      );
    });
  });

  it('should get explored stars when login', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const starsService: StarsService = TestBed.get(StarsService);
    const service: StarPresenceService = TestBed.get(StarPresenceService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getExploredStars().subscribe(
              starIds => {
                expect(starIds.size).toEqual(1);
                const arr = Array.from(starIds);
                const id = arr[0];
                const star = starsService.getStarById(id);
                expect(star.id).toEqual(id);

                expect(service.isStarExplored(id)).toBeTruthy();
                done();
              }
            );
          }
        }
      );
    });
  });

});
