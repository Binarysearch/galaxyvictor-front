import { TestBed } from '@angular/core/testing';

import { FleetsService } from './fleets.service';
import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService, PirosApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { registerLoginAndCreateCivilization, createApiService, quickStart } from '../login-utils';
import { Fleet } from '../../model/fleet';
import { StarsService } from './stars.service';
import { forkJoin, Subject, ReplaySubject } from 'rxjs';
import { first } from 'rxjs/operators';
import { StarSystem } from '../../model/star-system';
import { MapStateService } from '../map-state.service';
import { TimeService } from '../time.service';
import { PlanetsService } from './planets.service';
import { FleetInfoDto } from '../../dto/fleet-info';
import { NotificationService } from '../notification.service';

describe('FleetsService', () => {

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
                  
                  if (!travelStartSent) {
                    fleetsService.startTravel(fleet.id, fleet.destination.id, star.id).subscribe(result => {
                      expect(result).toBeTruthy();
                    });
                  }

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

  it('should not receive start travel or end travel notification if player cannot view the stars', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const starsService: StarsService = TestBed.get(StarsService);

    const apiService2 = createApiService();
    const notificationService: NotificationService = new NotificationService(apiService2);
    const authService2 = new AuthService(apiService2, TestBed.get(LocalStorageService), TestBed.get(MapStateService));
    const civilizationsService2 = new CivilizationsService(apiService2, authService2);
    const starsService2: StarsService = new StarsService(apiService2, authService2);
    const fleetsService2 = new FleetsService(starsService2, apiService2, authService2, civilizationsService2, TestBed.get(TimeService), notificationService);
    const planetsService2: PlanetsService = new PlanetsService(starsService2, apiService2, authService2, civilizationsService2, notificationService);

    let travelStartSent = false;
    let travelStartReceived = false;
    let fleetId;

    const secondHomeStar: Subject<StarSystem> = new Subject();
    const travelReceivedInFirstUser: Subject<void> = new Subject();


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
                fleetId = fleet.id;
                starsService.getStars().subscribe(stars => {
                  
                  secondHomeStar.subscribe(otherPlayerHomeStar => {

                    let star: StarSystem = stars[Math.floor(Math.random() * stars.length)];
                    while (star.id === otherPlayerHomeStar.id) {
                      star = stars[Math.floor(Math.random() * stars.length)];
                    }

                    if (!travelStartSent) {
                      fleetsService.startTravel(fleet.id, fleet.destination.id, star.id).subscribe(result => {
                        expect(result).toBeTruthy();
                      });
                      travelStartSent = true;
                    }

                    fleet.getChanges().subscribe(()=>{
                      travelStartReceived = true;
                      if (travelStartSent) {
                        travelReceivedInFirstUser.next();
                        travelReceivedInFirstUser.complete();
                      }
                    });
                  });

                });
              }
            );
          }
        }
      );
    });

    registerLoginAndCreateCivilization(authService2, civilizationsService2, () => {
      forkJoin(
        civilizationsService2.isLoaded().pipe(first(l => l)),
        planetsService2.isLoaded().pipe(first(l => l))
      ).subscribe(
        results => {
          civilizationsService2.getCivilization().subscribe(
            civ => {
              const homeStar = planetsService2.getPlanetById(civ.homeworldId).starSystem;
              secondHomeStar.next(homeStar);
              secondHomeStar.complete();

              notificationService.getStartTravelEvents().subscribe(()=>{
                fail('No deberia recibir el evento de inicio de viaje en el segundo usuario');
              });

              notificationService.getEndTravelEvents().subscribe(()=>{
                fail('No deberia recibir el evento de fin de viaje en el segundo usuario');
              });

              travelReceivedInFirstUser.subscribe(()=>{
                setTimeout(() => {
                  fleetsService2.getFleets().subscribe(fleets => {
                    fleets.forEach(f => {
                      if (f.id === fleetId) {
                        fail('La flota no deberia estar en el listado de flotas en el segundo usuario');
                      }
                    });
                    homeStar.incomingFleets.forEach(f=>{
                      if (f.id === fleetId) {
                        fail('La flota no deberia estar en el listado de flotas en el segundo usuario');
                      }
                    });
                    homeStar.orbitingFleets.forEach(f => {
                      if (f.id === fleetId) {
                        fail('La flota no deberia estar en el listado de flotas en el segundo usuario');
                      }
                    });
  
                    done();
                  });
                  expect(fleetsService2.getFleetById(fleetId)).toBeUndefined();
                }, 200);
              });
            }
          );

        }
      );
    });

  });

  it('should receive start travel and end travel notification if player can view the stars', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const starsService: StarsService = TestBed.get(StarsService);

    const apiService2 = createApiService();
    const notificationService2: NotificationService = new NotificationService(apiService2);
    const authService2 = new AuthService(apiService2, TestBed.get(LocalStorageService), TestBed.get(MapStateService));
    const civilizationsService2 = new CivilizationsService(apiService2, authService2);
    const starsService2: StarsService = new StarsService(apiService2, authService2);
    const fleetsService2 = new FleetsService(starsService2, apiService2, authService2, civilizationsService2, TestBed.get(TimeService), notificationService2);
    const planetsService2: PlanetsService = new PlanetsService(starsService2, apiService2, authService2, civilizationsService2, notificationService2);

    let travelStartSent = false;
    let travelStartReceived = false;
    let fleetId;

    const secondHomeStar: Subject<StarSystem> = new Subject();

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
                fleetId = fleet.id;
                starsService.getStars().subscribe(stars => {
                  
                  secondHomeStar.subscribe(otherPlayerHomeStar => {
                    if (!travelStartSent) {
                      fleetsService.startTravel(fleet.id, fleet.destination.id, otherPlayerHomeStar.id).subscribe(result => {
                        expect(result).toBeTruthy();
                      });
                      travelStartSent = true;
                    }
                  });

                });
              }
            );
          }
        }
      );
    });

    registerLoginAndCreateCivilization(authService2, civilizationsService2, () => {
      forkJoin(
        civilizationsService2.isLoaded().pipe(first(l => l)),
        planetsService2.isLoaded().pipe(first(l => l))
      ).subscribe(
        results => {
          civilizationsService2.getCivilization().subscribe(
            civ => {
              const homeStar = planetsService2.getPlanetById(civ.homeworldId).starSystem;
              

              let startTravelEventReceived = false;
              notificationService2.getStartTravelEvents().subscribe(()=>{
                startTravelEventReceived = true;
              });

              notificationService2.getEndTravelEvents().subscribe(()=>{
                if (!startTravelEventReceived) {
                  fail('No se ha recibido el evento de inicio de viaje');
                }
                done();
              });

              secondHomeStar.next(homeStar);
              secondHomeStar.complete();
            }
          );

        }
      );
    });

  });

  it('should receive delete fleet when enemy fleet starts travel to a not visible star', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const starsService: StarsService = TestBed.get(StarsService);
    const notificationService: NotificationService = TestBed.get(NotificationService);

    const apiService2 = createApiService();
    const notificationService2: NotificationService = new NotificationService(apiService2);
    const authService2 = new AuthService(apiService2, TestBed.get(LocalStorageService), TestBed.get(MapStateService));
    const civilizationsService2 = new CivilizationsService(apiService2, authService2);
    const starsService2: StarsService = new StarsService(apiService2, authService2);
    const fleetsService2 = new FleetsService(starsService2, apiService2, authService2, civilizationsService2, TestBed.get(TimeService), notificationService2);
    const planetsService2: PlanetsService = new PlanetsService(starsService2, apiService2, authService2, civilizationsService2, notificationService2);

    let travelStartSent = false;
    let fleetId;

    const secondHomeStar: Subject<StarSystem> = new Subject();

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
                fleetId = fleet.id;
                secondHomeStar.subscribe(otherPlayerHomeStar => {

                  notificationService.getEndTravelEvents().subscribe((ev) => {
                    if (ev.fleet.originId) {
                      starsService.getStars().subscribe(stars => {
                  
                        let star: StarSystem = stars[Math.floor(Math.random() * stars.length)];
                        while (star.id === otherPlayerHomeStar.id) {
                          star = stars[Math.floor(Math.random() * stars.length)];
                        }
                        if (!travelStartSent) {
                          fleetsService.startTravel(fleet.id, ev.fleet.originId, star.id).subscribe(result => {
                            expect(result).toBeTruthy();
                          });
                          travelStartSent = true;
                        }
      
                      });
                    }
                  });

                  fleetsService.startTravel(fleet.id, fleet.destination.id, otherPlayerHomeStar.id).subscribe();

                });
              }
            );
          }
        }
      );
    });

    registerLoginAndCreateCivilization(authService2, civilizationsService2, () => {
      forkJoin(
        civilizationsService2.isLoaded().pipe(first(l => l)),
        planetsService2.isLoaded().pipe(first(l => l))
      ).subscribe(
        results => {
          civilizationsService2.getCivilization().subscribe(
            civ => {
              const homeStar = planetsService2.getPlanetById(civ.homeworldId).starSystem;
              
              let enemyFleet: Fleet;
              notificationService2.getEndTravelEvents().subscribe(() => {
                enemyFleet = fleetsService2.getFleetById(fleetId);
                expect(enemyFleet).toBeDefined();
              });

              notificationService2.getDeleteFleetEvents().subscribe((event) => {
                expect(event.fleetId).toEqual(fleetId);

                setTimeout(() => {
                  const fleet = fleetsService2.getFleetById(fleetId);
                  expect(fleet).toBeUndefined();

                  expect(enemyFleet.origin.orbitingFleets.has(enemyFleet)).toBeFalsy();
                  expect(enemyFleet.origin.incomingFleets.has(enemyFleet)).toBeFalsy();
                  expect(enemyFleet.destination.orbitingFleets.has(enemyFleet)).toBeFalsy();
                  expect(enemyFleet.destination.incomingFleets.has(enemyFleet)).toBeFalsy();
                  expect(enemyFleet.civilization.fleets.has(enemyFleet)).toBeFalsy();

                  done();
                }, 200);
              });

              secondHomeStar.next(homeStar);
              secondHomeStar.complete();
            }
          );
        }
      );
    });

  });

  it('should receive visibility gain notification when travel ends', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const starsService: StarsService = TestBed.get(StarsService);
    const notificationService: NotificationService = TestBed.get(NotificationService);

    let travelStartSent = false;

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
                  
                  if (!travelStartSent) {
                    fleetsService.startTravel(fleet.id, fleet.destination.id, star.id).subscribe(result => {
                      expect(result).toBeTruthy();
                    });

                    travelStartSent = true;
                  }

                  notificationService.getVisibilityGainNotifications().subscribe((event) => {
                    expect(event.starId).toEqual(star.id);
                    done();
                  });
                });
              }
            );
          }
        }
      );
    });
  });

  it('should not receive visibility lost notification when travel ends  if user is still present in star', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const starsService: StarsService = TestBed.get(StarsService);
    const notificationService: NotificationService = TestBed.get(NotificationService);

    let firstTravelStartSent = false;

    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      forkJoin(
        fleetsService.isLoaded().pipe(first(l => l)),
        starsService.isLoaded().pipe(first(l => l))
      ).subscribe(
        results => {
          if (!firstTravelStartSent) {
            fleetsService.getFleets().subscribe(
              fleets => {
                const fleet: Fleet = fleets.values().next().value;
                const origin: StarSystem = fleet.origin;
                starsService.getStars().subscribe(stars => {
                  const star1: StarSystem = stars[Math.floor(Math.random() * stars.length)];
                  
                  if (!firstTravelStartSent) {
                    fleetsService.startTravel(fleet.id, fleet.destination.id, star1.id).subscribe(result => {
                      expect(result).toBeTruthy();
                    });
                    firstTravelStartSent = true;
                  }

                  notificationService.getVisibilityLostNotifications().subscribe((event) => {
                    fail('El usuario no deberia perder la visibilidad en el sistema');
                  });

                  notificationService.getEndTravelEvents().subscribe(() => {
                    setTimeout(() => {
                      done();
                    }, 200);
                  });
                });
              }
            );
          }
        }
      );
    });
  });

  it('should add enemy fleets when visibility gain', (done) => {
    
    let travelSent = false;

    quickStart((sd) => {
      quickStart((sd2) => {
        const homeStar1 = sd.homeStar;
        
        const fleet1 = sd.startingFleet;
        const fleet2 = sd2.startingFleet;

        sd2.services.notificationService.getVisibilityGainNotifications().subscribe((ev) => {
          if (ev.starId === homeStar1.id) {
            expect(ev.orbitingFleets.length).toEqual(2);
  
            setTimeout(() => {
              sd2.services.fleetsService.getFleets().subscribe(fleets => {
                expect(fleets.size).toEqual(2);
                expect(Array.from(fleets).find(f => f.id === fleet1.id)).toBeTruthy();
                done();
              });
            }, 1);
          }
        });

        //viajar estrella enemiga
        if (!travelSent) {
          sd2.services.fleetsService.startTravel(fleet2.id, fleet2.origin.id, homeStar1.id).subscribe();
          travelSent = true;
        }

      });
    });

    
  });

  it('should remove enemy fleets when visibility lost', (done) => {
    
    let travel1Sent = false;
    let travel2Sent = false;

    quickStart((sd) => {
      quickStart((sd2) => {
        const homeStar1 = sd.homeStar;
        const homeStar2 = sd2.homeStar;
        
        const fleet1 = sd.startingFleet;
        const fleet2 = sd2.startingFleet;

        sd2.services.notificationService.getVisibilityLostNotifications().subscribe((ev) => {
          if (ev.starId === homeStar1.id) {  
            setTimeout(() => {
              sd2.services.fleetsService.getFleets().subscribe(fleets => {
                expect(fleets.size).toEqual(1);
                expect(Array.from(fleets).find(f => f.id === fleet1.id)).toBeFalsy();
                done();
              });
            }, 1);
          }
        });

        if (!travel1Sent) {
          sd2.services.fleetsService.startTravel(fleet2.id, fleet2.origin.id, homeStar1.id).subscribe();
          travel1Sent = true;
        }

        sd2.services.notificationService.getEndTravelEvents().subscribe((ev) => {
          if (ev.fleet.destinationId === homeStar1.id) {
            if (!travel2Sent) {
              sd2.services.fleetsService.startTravel(fleet2.id, homeStar1.id, homeStar2.id).subscribe();
              travel2Sent = true;
            }
          }
        });
      });
    });

    
  });

});
