import { TestBed } from '@angular/core/testing';

import { PlanetsService } from './planets.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService, PirosApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { LocalStorageService } from '../local-storage.service';
import { registerLoginAndCreateCivilization, createApiService, quickStart } from '../login-utils';
import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { MapStateService } from '../map-state.service';
import { EventService } from '../event.service';
import { StarsService } from './stars.service';
import { NotificationService } from '../notification.service';

describe('PlanetsService', () => {

  beforeEach((done) => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: ApiService, useValue: {} },
        { provide: PIROS_API_SERVICE_CONFIG, useValue: config }
      ]
    });
    TestBed.get(PirosApiService).post('civilizations.restore-state', '').subscribe(() => done());

    const localStorageService: LocalStorageService = TestBed.get(LocalStorageService);
    localStorageService.deleteSavedToken();

  });

  it('should get planets when login', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const service: PlanetsService = TestBed.get(PlanetsService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getPlanets().subscribe(
              planets => {
                expect(planets.size).toBeGreaterThan(0);
                expect(Array.from(planets)[0].id).toBeDefined();
                done();
              }
            );
          }
        }
      );
    });
  });

  it('should get planets by id', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const service: PlanetsService = TestBed.get(PlanetsService);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getPlanets().subscribe(
              planets => {
                const pArray = Array.from(planets);
                expect(planets.size).toBeGreaterThan(0);
                expect(pArray[0].id).toBeDefined();
                const planet = service.getPlanetById(pArray[0].id);
                expect(planet.id).toEqual(pArray[0].id);
                expect(planet.size).toEqual(pArray[0].size);
                expect(planet.type).toEqual(pArray[0].type);
                done();
              }
            );
          }
        }
      );
    });
  });

  it('should not get planets from other civilization when login', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const service: PlanetsService = TestBed.get(PlanetsService);
    
    const apiService2 = createApiService();
    const notificationService2: NotificationService = new NotificationService(apiService2);
    const authService2 = new AuthService(apiService2, TestBed.get(LocalStorageService), TestBed.get(MapStateService));
    const civilizationsService2 = new CivilizationsService(apiService2, authService2);
    const service2: PlanetsService = new PlanetsService(TestBed.get(StarsService), apiService2, authService2, civilizationsService2, notificationService2);

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getPlanets().subscribe(
              planets1 => {

                registerLoginAndCreateCivilization(authService2, civilizationsService2, () => {
                  service2.isLoaded().subscribe(
                    loaded => {
                      if (loaded) {
                        service2.getPlanets().subscribe(
                          planets2 => {
                            planets1.forEach(p => {
                              const found = Array.from(planets2).find(p2 => p2.id === p.id);
                              expect(found).toBeFalsy();
                            });
                            done();
                          }
                        );
                      }
                    }
                  );
                });

              }
            );
          }
        }
      );
    });

    

  });

  it('should get planets from other stars when explore them', (done) => {
    let traveled = false;

    quickStart((sd) => {
      sd.services.planetsService.getPlanets().subscribe(planets => {
        if (traveled) {

          planets.forEach(p => {
            if (p.starSystem.id !== sd.homeStar.id) {
              done();
            }
          });
          
        } else {

          planets.forEach(p => {
            expect(p.starSystem).toEqual(sd.homeStar);
          });

          sd.services.fleetsService.startTravel(sd.startingFleet.id, sd.homeStar.id, sd.getRandomStar().id).subscribe(
            () => {
              traveled = true;
            }
          );
        }
      });
    });
  });
});

