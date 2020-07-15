import { TestBed } from '@angular/core/testing';

import { HttpClientModule, HttpClient } from '@angular/common/http';
import { PIROS_API_SERVICE_CONFIG, ApiService, PirosApiService, ConnectorManagerService, IdGeneratorService, RequestService, ChannelService } from '@piros/api';
import { config } from '../config';
import { registerAndLogin, registerLoginAndCreateCivilization } from '../login-utils';
import { LocalStorageService } from '../local-storage.service';
import { AuthService } from '../auth.service';
import { AuthService as PirosAuthService } from '@piros/api';
import { CivilizationsService } from './civilizations.service';
import { MapStateService } from '../map-state.service';

describe('CivilizationsService', () => {

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

  it('should not get civilization when login with new user', (done) => {
    const authService = TestBed.get(AuthService);
    const service: CivilizationsService = TestBed.get(CivilizationsService);

    registerAndLogin(authService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getCivilization().subscribe(
              civilization => {
                expect(civilization).toBeNull();
                done();
              }
            );
          }
        }
      );
    });
  });

  it('should get null civilization when logout', (done) => {
    const authService = TestBed.get(AuthService);
    const service: CivilizationsService = TestBed.get(CivilizationsService);

    const civilizationName = 'civilization-' + Math.random();
    let secondTime = false;

    registerAndLogin(authService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getCivilization().subscribe(
              civ => {
                if (!civ) {
                  if (!secondTime) {
                    service.createCivilization(civilizationName).subscribe();
                    secondTime = true;
                  } else {
                    expect(secondTime).toBeTruthy();
                    done();
                  }
                } else {
                  authService.closeSession();
                }
              }
            );
          }
        }
      );
    });
    
  });

  it('should get notification when create civilization', (done) => {
    const authService = TestBed.get(AuthService);
    const service: CivilizationsService = TestBed.get(CivilizationsService);

    const civilizationName = 'civilization-' + Math.random();

    registerAndLogin(authService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getCivilization().subscribe(
              civ => {
                if (civ) {
                  expect(civ.id).toBeDefined();
                  expect(civ.name).toEqual(civilizationName);
                  done();
                }
              }
            );
          }
        }
      );

      service.createCivilization(civilizationName).subscribe();
    });

  });

  it('should create civilization', (done) => {
    const authService = TestBed.get(AuthService);
    const service: CivilizationsService = TestBed.get(CivilizationsService);

    const civilizationName = 'civilization-' + Math.random();

    registerAndLogin(authService, () => {
      service.createCivilization(civilizationName).subscribe(id => {
        expect(id).toBeDefined();
        done();
      })
    });

  });

  it('should get civilization when login with an user thas has civilization', (done) => {
    const authService = TestBed.get(AuthService);
    const service: CivilizationsService = TestBed.get(CivilizationsService);

    const civilizationName = 'civilization-' + Math.random();

    let civilizationId;

    registerAndLogin(authService, (user, password) => {
      

      service.createCivilization(civilizationName).subscribe(civId => {
        civilizationId = civId;
        authService.closeSession();
        authService.login(user, password).subscribe(()=>{

          service.isLoaded().subscribe(
            loaded => {
              if (loaded) {
                service.getCivilization().subscribe(
                  civ => {
                    if (civ) {
                      expect(civ.id).toBeDefined();
                      expect(civ.name).toEqual(civilizationName);
                      expect(civ.homeworldId).toBeDefined();
                      done();
                    }
                  }
                );
              }
            }
          );

        });
      });
    });

  });

  it('should not get notification when create civilization with other user', (done) => {
    const authService = TestBed.get(AuthService);
    const service: CivilizationsService = TestBed.get(CivilizationsService);

    const apiService2 = createApiService();
    const authService2 = new AuthService(apiService2, TestBed.get(LocalStorageService), TestBed.get(MapStateService));
    const service2: CivilizationsService = new CivilizationsService(apiService2, authService2);

    const civilizationName = 'civilization-' + Math.random();

    registerAndLogin(authService, () => {
      service.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service.getCivilization().subscribe(
              civ => {
                if (civ) {
                  fail('Should not get civilization');
                  done();
                }
              }
            );
          }
        }
      );

    });
    
    registerAndLogin(authService2, () => {
      service2.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            service2.getCivilization().subscribe(
              civ => {
                if (civ) {
                  expect(civ.id).toBeDefined();
                  expect(civ.name).toEqual(civilizationName);
                  done();
                }
              }
            );
          }
        }
      );

      service2.createCivilization(civilizationName).subscribe();
    });

  });

  it('should get player civiliz ations by id', (done) => {
    const authService = TestBed.get(AuthService);
    const civilizationsService: CivilizationsService = TestBed.get(CivilizationsService);
    
    registerLoginAndCreateCivilization(authService, civilizationsService, () => {
      civilizationsService.isLoaded().subscribe(
        loaded => {
          if (loaded) {
            civilizationsService.getCivilization().subscribe(
              civilization => {
                if (civilization) {
                  expect(civilizationsService.getCivilizationById(civilization.id)).toEqual(civilization);
                  done();
                }
              }
            );
          }
        }
      );
    });
    
  });
});


function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new PirosAuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}