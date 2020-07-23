import { TestBed } from '@angular/core/testing';

import { ShipsService } from './ships.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, PIROS_API_SERVICE_CONFIG, PirosApiService } from '@piros/api';
import { config } from '../config';
import { LocalStorageService } from '../local-storage.service';
import { quickStart } from '../login-utils';
import { Colony } from 'src/app/model/colony';
import { BuildingOrderType } from 'src/app/dto/building-order-dto';
import { CreateShipNotificationDto } from 'src/app/dto/create-ship-notification';

describe('ShipsService', () => {

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

  it('should get fleet ships', (done) => {

    quickStart((sd) => {

      sd.services.shipsService.getFleetShips(sd.startingFleet.id).subscribe(ships => {
        expect(ships.length).toEqual(1);
        expect(ships[0].id).toBeDefined();
        done();
      });

    });
  });

  it('should create ships', (done) => {

    quickStart((sd) => {

      sd.services.coloniesService.getColonies().subscribe(colonies => {
        if (colonies.size > 0) {
          const colony: Colony = colonies.values().next().value;

          sd.services.shipsService.buildShip(colony.id).subscribe(result => {
            expect(result).toBeTruthy();
            done();
          });
        }
      });

    });
  });

  it('should receive ship building orders notification when creating ship', (done) => {

    let shipCreated;
    let colony: Colony;

    quickStart((sd) => {

      sd.services.coloniesService.getColonies().subscribe(colonies => {
        if (colonies.size > 0 && !shipCreated) {
          colony = colonies.values().next().value;
          sd.services.shipsService.buildShip(colony.id).subscribe(result => {
            expect(result).toBeTruthy();
          });
          shipCreated = true;
        }
      });

      let notificationNumber = 1;
      let buildingOrderId;
      sd.services.notificationService.getBuildingOrdersNotifications().subscribe(notification => {
        if (notificationNumber === 1) {
          notificationNumber++;
          expect(notification.buildingOrders.length).toEqual(1);
          expect(notification.finishedBuildingOrders.length).toEqual(0);
          const buildingOrder = notification.buildingOrders[0];
          expect(buildingOrder.colonyId).toEqual(colony.id);
          expect(buildingOrder.id).toBeDefined();
          buildingOrderId = buildingOrder.id;
          expect(buildingOrder.type).toEqual(BuildingOrderType.SHIP);
          expect(buildingOrder.endTime).toBeDefined();
          expect(buildingOrder.startedTime).toBeDefined();
        } else if (notificationNumber === 2) {
          notificationNumber++;
          expect(notification.buildingOrders.length).toEqual(0);
          expect(notification.finishedBuildingOrders.length).toEqual(1);
          expect(notification.finishedBuildingOrders[0].id).toEqual(buildingOrderId);
          expect(notification.finishedBuildingOrders[0].colonyId).toEqual(colony.id);
          done();
        } else {
          fail('Should not receive more building order notifications')
        }
      });

    });
  });

  it('should update colony with ship building orders notifications when creating ships', (done) => {

    let shipCreated;
    let colony: Colony;

    quickStart((sd) => {

      sd.services.coloniesService.getColonies().subscribe(colonies => {
        if (colonies.size > 0 && !shipCreated) {
          colony = colonies.values().next().value;

          let notificationNumber = 1;

          colony.getChanges().subscribe(() => {
            if (notificationNumber === 1) {
              notificationNumber++;
              expect(colony.buildingOrders.length).toEqual(1);
              const buildingOrder = colony.buildingOrders[0];
              expect(buildingOrder.colony).toEqual(colony);
              expect(buildingOrder.id).toBeDefined();
              expect(buildingOrder.type).toEqual(BuildingOrderType.SHIP);
              expect(buildingOrder.endTime).toBeDefined();
              expect(buildingOrder.startedTime).toBeDefined();

            } else if (notificationNumber === 2) {
              notificationNumber++;
              expect(colony.buildingOrders.length).toEqual(0);
              done();
            } else {
              fail('Should not receive more building order colony updates')
            }
          });

          sd.services.shipsService.buildShip(colony.id).subscribe(result => {
            expect(result).toBeTruthy();
          });
          shipCreated = true;
        }
      });

    });
  });

  it('should receive notification when create ships', (done) => {

    let shipCreated;

    quickStart((sd) => {
      quickStart((sd2) => {

        sd2.services.fleetsService.startTravel(sd2.startingFleet.id, sd2.startingFleet.origin.id, sd.homeStar.id).subscribe();
        
        sd.services.notificationService.getEndTravelEvents().subscribe(ev => {
          sd.services.coloniesService.getColonies().subscribe(colonies => {
            if (colonies.size > 0 && !shipCreated) {
              const colony: Colony = colonies.values().next().value;
              sd.services.shipsService.buildShip(colony.id).subscribe(result => {
                expect(result).toBeTruthy();
              });
              shipCreated = true;
            }
          });
        });

        let notificationCount = 0;
        const checkCreateShipNotification = (notification: CreateShipNotificationDto) => {
          expect(notification.fleet.id).toEqual(sd.startingFleet.id);
          expect(notification.fleet.shipCount).toEqual(2);
          expect(notification.ship).toBeDefined();
          expect(notification.ship.id).toBeDefined();

          setTimeout(() => {
            expect(sd.startingFleet.shipCount).toEqual(2);

            sd.services.shipsService.getFleetShips(sd.startingFleet.id).subscribe(ships => {
              expect(ships.length).toEqual(2);
              notificationCount++;
              if (notificationCount === 2) {
                done();
              }
            });

          }, 1);
        };

        sd.services.notificationService.getCreateShipNotifications().subscribe(notification => {
          checkCreateShipNotification(notification);
        });

        sd2.services.notificationService.getCreateShipNotifications().subscribe(notification => {
          checkCreateShipNotification(notification);
        });

      });
    });
  });

  it('should create fleet if there is no fleet from same civilization in star when creating ship', (done) => {

    let endedTravels: number = 0;
    quickStart((sd) => {
      quickStart((sd2) => {

        const randomStar = sd.getRandomStar();

        sd2.services.fleetsService.startTravel(sd2.startingFleet.id, sd2.startingFleet.origin.id, sd.homeStar.id).subscribe();
        sd.services.fleetsService.startTravel(sd.startingFleet.id, sd.startingFleet.origin.id, randomStar.id).subscribe();

        sd.services.notificationService.getEndTravelEvents().subscribe(ev => {
          endedTravels++;
          if (endedTravels === 2) {
            sd.services.coloniesService.getColonies().subscribe(colonies => {
              if (colonies.size > 0) {
                const colony: Colony = colonies.values().next().value;
                sd.services.shipsService.buildShip(colony.id).subscribe();
              }
            });
          }
        });

        sd.services.notificationService.getCreateShipNotifications().subscribe(ev => {
          expect(ev.fleet.id).not.toEqual(sd.startingFleet.id);
          expect(ev.fleet.id).not.toEqual(sd2.startingFleet.id);
          setTimeout(() => {
            expect(sd.services.fleetsService.getFleetById(ev.fleet.id)).toBeTruthy();
            expect(sd.homeStar.orbitingFleets.size).toEqual(2);
            expect(sd.homeStar.hasAlliedFleets).toBeTruthy();
            expect(sd.homeStar.hasEnemyFleets).toBeTruthy();
            done();
          }, 1);
        });

      });
    });
  });


});