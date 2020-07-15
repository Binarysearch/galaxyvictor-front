import { TestBed } from '@angular/core/testing';

import { StarsService } from './stars.service';
import { HttpClientModule } from '@angular/common/http';
import { PIROS_API_SERVICE_CONFIG, ApiService, PirosApiService } from '@piros/api';
import { config } from '../config';
import { registerAndLogin } from '../login-utils';
import { LocalStorageService } from '../local-storage.service';
import { AuthService } from '../auth.service';

describe('StarsService', () => {


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

  it('should get stars when login', (done) => {
    const authService = TestBed.get(AuthService);
    const service: StarsService = TestBed.get(StarsService);

    registerAndLogin(authService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getStars().subscribe(
              stars => {
                expect(stars[0]).toBeDefined();
                expect(stars[0].id).toBeDefined();
                done();
              }
            );
          }
        }
      );
    });
  });

  it('should get stars by id', (done) => {
    const authService = TestBed.get(AuthService);
    const service: StarsService = TestBed.get(StarsService);

    registerAndLogin(authService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getStars().subscribe(
              stars => {
                expect(stars[0]).toBeDefined();
                expect(stars[0].id).toBeDefined();
                const star = service.getStarById(stars[0].id);
                expect(star).toEqual(stars[0]);
                done();
              }
            );
          }
        }
      );
    });
  });
});
