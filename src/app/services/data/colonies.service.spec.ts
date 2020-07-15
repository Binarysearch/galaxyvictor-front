import { TestBed } from '@angular/core/testing';

import { CivilizationsService } from './civilizations.service';
import { AuthService } from '../auth.service';
import { LocalStorageService } from '../local-storage.service';
import { config } from '../config';
import { PIROS_API_SERVICE_CONFIG, ApiService, PirosApiService } from '@piros/api';
import { HttpClientModule } from '@angular/common/http';
import { registerLoginAndCreateCivilization, quickStart, ServicesAndData } from '../login-utils';

import { ColoniesService } from './colonies.service';
import { Observable } from 'rxjs';
import { Fleet } from 'src/app/model/fleet';
import { StarSystem } from 'src/app/model/star-system';
import { first } from 'rxjs/operators';
import { Colony } from 'src/app/model/colony';

describe('ColoniesService', () => {

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

  it('should get colonies from visible stars', (done) => {

    let travelSent = false;

    quickStart((sd1) => {

      quickStart((sd2) => {

        const homeStar1 = sd1.homeStar;
        const fleet2 = sd2.startingFleet;

        sd2.services.coloniesService.isLoaded().pipe(first(l => l)).subscribe(() => {
          sd2.services.coloniesService.getColonies().subscribe(colonies => {
            if (!travelSent) {
              travelSent = true;
              sd2.services.fleetsService.startTravel(fleet2.id, fleet2.origin.id, homeStar1.id).subscribe();
              expect(colonies.size).toEqual(1);
            } else {
              expect(colonies.size).toEqual(2);
              done();
            }
          });
        });

      });

    });

  });

  it('should create colony', (done) => {

    let travelSent = false;
    let colonyCreated = false;

    quickStart((sd) => {
      const starToCreateColony = sd.getRandomStar();
      const fleet = sd.startingFleet;

      //viajar estrella aleatoria
      if (!travelSent) {
        sd.services.fleetsService.startTravel(fleet.id, fleet.origin.id, starToCreateColony.id).subscribe();
        travelSent = true;
      }

      //crear colonia en planeta nuevo
      sd.services.planetsService.getPlanets().subscribe(planets => {
        if (travelSent && !colonyCreated) {
          const planetToCreateColony = Array.from(planets).find(p => p.starSystem.id === starToCreateColony.id);
          if (planetToCreateColony) {

            sd.services.coloniesService.createColony(planetToCreateColony.id).subscribe(result => {
              expect(result).toBeTruthy();
            });
            colonyCreated = true;

            sd.services.notificationService.getCreateColonyNotification().subscribe(notification => {
              expect(notification.planet).toEqual(planetToCreateColony.id);
            });
          }
        }
      });

      //comprobar que se  ha creado la colonia
      sd.services.coloniesService.isLoaded().subscribe(loaded => {
        if (loaded) {
          sd.services.coloniesService.getColonies().subscribe(colonies => {
            if (!colonyCreated) {
              expect(colonies.size).toEqual(1);
            } else {
              expect(colonies.size).toEqual(2);
              done();
            }
          });
        }
      });

    });

  });

  it('should see colonies when visibility gain', (done) => {

    let travelSent = false;
    let travelFinished = false;
    let travel2Sent = false;
    let travel2Finished = false;
    let colonyCreated = false;

    quickStart((sd) => {
      quickStart((sd2) => {
        const starToCreateColony = sd.getRandomStar();
        const fleet = sd.startingFleet;
        const fleet2 = sd2.startingFleet;

        sd.services.notificationService.getEndTravelEvents().subscribe(() => {
          travelFinished = true;
        });

        //viajar estrella aleatoria
        if (!travelSent) {
          sd.services.fleetsService.startTravel(fleet.id, fleet.origin.id, starToCreateColony.id).subscribe();
          travelSent = true;
        }

        //crear colonia en planeta nuevo
        sd.services.planetsService.getPlanets().subscribe(planets => {
          if (travelFinished && !colonyCreated) {
            const planetToCreateColony = Array.from(planets).find(p => p.starSystem.id === starToCreateColony.id);
            if (travelFinished) {
              sd.services.coloniesService.createColony(planetToCreateColony.id).subscribe();
              colonyCreated = true;
            }
          }
        });

        sd.services.notificationService.getCreateColonyNotification().subscribe(()=>{
          //comprobar la visibilidad la colonia en la civilizacion 2
          sd2.services.coloniesService.getColonies().subscribe(colonies => {
            if (!travel2Finished) {
              expect(colonies.size).toEqual(1);

              if (!travel2Sent) {
                sd2.services.fleetsService.startTravel(fleet2.id, fleet2.origin.id, starToCreateColony.id).subscribe();
                travel2Sent = true;
              }
            } else {
              expect(colonies.size).toEqual(2);
              done();
            }
          });

          sd2.services.notificationService.getEndTravelEvents().subscribe((ev) => {
            travel2Finished = true;
          });
        });

      });
    });

  });

  it('should stop seeing colonies when visibility lost', (done) => {

    let travelSent = false;
    let travelFinished = false;
    let travel2Sent = false;
    let travel2Finished = false;
    let travel3Sent = false;
    let colonyCreated = false;

    quickStart((sd) => {
      quickStart((sd2) => {
        const starToCreateColony = sd.getRandomStar();
        const randomStar = sd2.getRandomStar();
        const fleet = sd.startingFleet;
        const fleet2 = sd2.startingFleet;

        sd.services.notificationService.getEndTravelEvents().subscribe(() => {
          travelFinished = true;
        });

        //viajar estrella aleatoria
        if (!travelSent) {
          sd.services.fleetsService.startTravel(fleet.id, fleet.origin.id, starToCreateColony.id).subscribe();
          travelSent = true;
        }

        //crear colonia en planeta nuevo
        sd.services.planetsService.getPlanets().subscribe(planets => {
          if (travelFinished && !colonyCreated) {
            const planetToCreateColony = Array.from(planets).find(p => p.starSystem.id === starToCreateColony.id);
            if (travelFinished) {
              sd.services.coloniesService.createColony(planetToCreateColony.id).subscribe();
              colonyCreated = true;
            }
          }
        });

        let colony: Colony;

        //comprobar la visibilidad la colonia en la civilizacion 2
        sd2.services.coloniesService.isLoaded().subscribe(loaded => {
          if (loaded) {
            sd2.services.coloniesService.getColonies().subscribe(colonies => {
              if (!travel2Finished) {
                expect(colonies.size).toEqual(1);
              } else if (!travel3Sent) {
                expect(colonies.size).toEqual(2);
                colony = Array.from(colonies).find(c => c.planet.starSystem.id !== sd2.homeStar.id);
                sd2.services.fleetsService.startTravel(fleet2.id, starToCreateColony.id, randomStar.id).subscribe();
                travel3Sent = true;
              } else {
                expect(colonies.size).toEqual(1);
                expect(colony.planet.colony).toBeNull();
                done();
              }
            });
          }
        });
        
        sd2.services.notificationService.getEndTravelEvents().subscribe((ev) => {
          if (ev.fleet.destinationId === starToCreateColony.id) {
            travel2Finished = true;
          }
        });

        if (!travel2Sent) {
          sd2.services.fleetsService.startTravel(fleet2.id, fleet2.origin.id, starToCreateColony.id).subscribe();
          travel2Sent = true;
        }

      });
    });

  });

});