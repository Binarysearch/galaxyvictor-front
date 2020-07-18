import { TestBed } from '@angular/core/testing';

import { ShipsService } from './ships.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, PIROS_API_SERVICE_CONFIG, PirosApiService } from '@piros/api';
import { config } from '../config';
import { LocalStorageService } from '../local-storage.service';
import { quickStart } from '../login-utils';
import { Colony } from 'src/app/model/colony';
import { BuildingOrderType } from 'src/app/dto/building-order-dto';

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
    let colonyId;

    quickStart((sd) => {

      sd.services.coloniesService.getColonies().subscribe(colonies => {
        if (colonies.size > 0 && !shipCreated) {
          const colony: Colony = colonies.values().next().value;
          colonyId = colony.id;
          sd.services.shipsService.buildShip(colonyId).subscribe(result => {
            expect(result).toBeTruthy();
          });
          shipCreated = true;
        }
      });

      let notificationNumber = 1;
      sd.services.notificationService.getBuildingOrdersNotification().subscribe(notification => {
        if (notificationNumber === 1) {
          notificationNumber++;
          expect(notification.buildingOrders.length).toEqual(1);
          const buildingOrder = notification.buildingOrders[0];
          expect(buildingOrder.colonyId).toEqual(colonyId);
          expect(buildingOrder.id).toBeDefined();
          expect(buildingOrder.type).toEqual(BuildingOrderType.SHIP);
          expect(buildingOrder.endTime).toBeDefined();
          expect(buildingOrder.startedTime).toBeDefined();
        } else if (notificationNumber === 2) {
          notificationNumber++;
          expect(notification.buildingOrders.length).toEqual(0);
          done();
        } else {
          fail('Should not receive more building order notifications')
        }
      });

    });
  });

  it('should receive notification when create ships', (done) => {
    
    let shipCreated;

    quickStart((sd) => {

      sd.services.coloniesService.getColonies().subscribe(colonies => {
        if (colonies.size > 0 && !shipCreated) {
          const colony: Colony = colonies.values().next().value;
          sd.services.shipsService.buildShip(colony.id).subscribe(result => {
            expect(result).toBeTruthy();
          });
          shipCreated = true;
        }
      });

      sd.services.notificationService.getCreateShipNotification().subscribe(notification => {
        expect(notification.fleet.id).toEqual(sd.startingFleet.id);
        expect(notification.fleet.shipCount).toEqual(2);
        expect(notification.ship).toBeDefined();
        expect(notification.ship.id).toBeDefined();

        setTimeout(() => {
          expect(sd.startingFleet.shipCount).toEqual(2);

          sd.services.shipsService.getFleetShips(sd.startingFleet.id).subscribe(ships => {
            expect(ships.length).toEqual(2);
            done();
          });

        }, 1);
      });

    });
  });


});