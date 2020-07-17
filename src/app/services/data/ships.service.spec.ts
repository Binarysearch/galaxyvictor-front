import { TestBed } from '@angular/core/testing';

import { ShipsService } from './ships.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, PIROS_API_SERVICE_CONFIG, PirosApiService } from '@piros/api';
import { config } from '../config';
import { LocalStorageService } from '../local-storage.service';
import { quickStart } from '../login-utils';
import { Colony } from 'src/app/model/colony';

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


});