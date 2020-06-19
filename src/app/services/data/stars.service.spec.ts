import { TestBed } from '@angular/core/testing';

import { StarsService } from './stars.service';
import { HttpClientModule } from '@angular/common/http';
import { PIROS_API_SERVICE_CONFIG, ApiService } from '@piros/api';
import { config } from '../config';
import { loginWithCivilization } from '../login-utils';
import { GvApiService } from '../gv-api.service';
import { LocalStorageService } from '../local-storage.service';

describe('StarsService', () => {
  

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

  it('should get stars when login', (done) => {
    const apiService = TestBed.get(GvApiService);
    const service: StarsService = TestBed.get(StarsService);

    loginWithCivilization(apiService, () => {
      service.getStars().subscribe(
        stars => {
          expect(stars[0]).toBeDefined();
          expect(stars[0].id).toBeDefined();
          done();
        }
      );
    });
  });

  it('should get stars by id', (done) => {
    const apiService = TestBed.get(GvApiService);
    const service: StarsService = TestBed.get(StarsService);
    
    loginWithCivilization(apiService, () => {
      service.getStars().subscribe(
        stars => {
          expect(stars[0]).toBeDefined();
          expect(stars[0].id).toBeDefined();
          const star = service.getStarById(stars[0].id);
          expect(star).toEqual(stars[0]);
          done();
        }
      );
    });
  });
});
