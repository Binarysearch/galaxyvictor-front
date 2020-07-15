import { TestBed } from '@angular/core/testing';

import { ShipsService } from './ships.service';
import { HttpClientModule } from '@angular/common/http';
import { ApiService, PIROS_API_SERVICE_CONFIG, PirosApiService } from '@piros/api';
import { config } from '../config';
import { LocalStorageService } from '../local-storage.service';
import { AuthService } from '../auth.service';
import { CivilizationsService } from './civilizations.service';
import { FleetsService } from './fleets.service';
import { Fleet } from 'src/app/model/fleet';
import { registerLoginAndCreateCivilization } from '../login-utils';

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
    const authService = TestBed.get(AuthService);
    const civilizationsService = TestBed.get(CivilizationsService);
    const fleetsService: FleetsService = TestBed.get(FleetsService);
    const shipsService: ShipsService = TestBed.get(ShipsService);

    startAndGetFleet(authService, civilizationsService, fleetsService, (fleet) => {
      
      shipsService.getFleetShips(fleet.id).subscribe(ships => {
        expect(ships.length).toEqual(1);
        expect(ships[0].id).toBeDefined();
        done();
      });

    });

  });
});


function startAndGetFleet(
  authService: AuthService, 
  civilizationsService: CivilizationsService, 
  fleetsService: FleetsService, 
  callback: (fleet: Fleet) => void
) {
  registerLoginAndCreateCivilization(authService, civilizationsService, () => {
    fleetsService.isLoaded().subscribe(
      loaded => {
        if (loaded) {
          fleetsService.getFleets().subscribe(
            fleets => {
              callback(fleets.values().next().value);
            }
          );
        }
      }
    );
  });
}