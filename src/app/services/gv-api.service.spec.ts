import { TestBed, tick } from '@angular/core/testing';

import { GvApiService } from './gv-api.service';
import { ApiService, PirosApiServiceConfig, PIROS_API_SERVICE_CONFIG, PirosApiService, ConnectorManagerService, IdGeneratorService, AuthService, RequestService, ChannelService } from '@piros/api';
import { HttpClientModule, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';

const config: PirosApiServiceConfig = {
  services: [
    {
      id: 'civilizations',
      url: 'ws://localhost:3001/',
      requestTypes: [
        'get-civilization',
        'create-civilization'
      ]
    },
    {
      id: 'galaxy',
      url: 'ws://localhost:3002/',
      requestTypes: [
        'get-stars'
      ]
    }
  ]
} 

describe('GvApiService', () => {

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

  it('should be created', () => {
    const service: GvApiService = TestBed.get(GvApiService);
    expect(service).toBeTruthy();
  });

  it('should register user', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';

    service.register(user, password).subscribe(userId => {
      expect(userId).toBeDefined();
      done();
    });

  });

  it('should not register with existing user', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';

    service.register(user, password).subscribe(() => {
      
      service.register(user, password).subscribe(
        () => {}, 
        error => {
          expect((<HttpErrorResponse>error).status).toEqual(409);
          expect(error).toBeDefined();
          done();
        }
      );
    });

  });

  it('should login with registered user', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        expect(status.sessionStarted).toBeTruthy();
        done();
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });

  it('should not login with unregistered user', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';

    service.login(user, password).subscribe(
      () => {},
      (err) => {
        expect(err).toEqual('INVALID_CREDENTIALS');
        done();
      }
    );

  });

  it('should auto login with previously generated token', (done) => {
    const service1: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service1.register(user, password).subscribe(() => {
      service1.login(user, password).subscribe((session) => {
        
        const service2 = createGvApiServiceWithInitialToken();

        service2.getStatus().subscribe(
          status => {
            if (status.sessionStarted) {
              expect(status.sessionStarted).toBeTruthy();
              done();
            }
          }
        );

      });
    });

  });

  it('should not auto login with previously generated token if session was closed', (done) => {
    const service1: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service1.register(user, password).subscribe(() => {
      service1.login(user, password).subscribe((session) => {
        
        service1.closeSession();

        const service2 = createGvApiServiceWithInitialToken();

        setTimeout(() => {
          done();
        }, 500);

        service2.getStatus().subscribe(
          status => {
            expect(status.sessionStarted).toBeFalsy();
          }
        );

      });
    });

  });

  it('should save session state', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        
        service.setSessionstate({
          cameraX: 12,
          cameraY: 13,
          cameraZ: 14,
          selectedId: '15'
        }).subscribe(() => {

          const service2 = createGvApiServiceWithInitialToken();

          service2.getStatus().subscribe(
            status => {
              if (status.sessionStarted) {
                service.getSessionState().subscribe((state) => {

                  expect(state).toEqual({
                    cameraX: 12,
                    cameraY: 13,
                    cameraZ: 14,
                    selectedId: '15'
                  });

                  done();
                });
              }
            }
          );
          
        });
        
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });

  it('should delete session state when login', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        
        service.setSessionstate({
          cameraX: 12,
          cameraY: 13,
          cameraZ: 14,
          selectedId: '15'
        }).subscribe(() => {

          const service2 = createGvApiServiceWithInitialToken();

          service2.login(user, password).subscribe((session) => {
            
            service2.getStatus().subscribe(
              status => {
                if (status.sessionStarted) {
                  service.getSessionState().subscribe((state) => {

                    expect(state).toEqual(<any>{});

                    done();
                  });
                }
              }
            );

          });
            
          
        });
        
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });

  it('should get stars data when login', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        expect(status.stars).toBeDefined();
        expect(status.stars[0]).toBeDefined();
        expect(status.stars[0].id).toBeDefined();
        expect(status.stars[0].x).toBeDefined();
        expect(status.stars[0].y).toBeDefined();
        expect(status.stars[0].name).toBeDefined();
        expect(status.stars[0].size).toBeDefined();
        expect(status.stars[0].type).toBeDefined();
        done();
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });

  it('should not get civilization when is new user', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const password = '12345';
    
    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        expect(status.civilization).toBeNull();
        done();
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });

  it('should create civilization', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const civilizationName = 'civilization-' + Math.random();
    const password = '12345';
    
    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        expect(status.civilization).toBeNull();
        service.createCivilization(civilizationName).subscribe(id => {
          expect(id).toBeDefined();
          done();
        })
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });

  it('should get civilization when login with an user thas has civilization', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);
    
    const user = 'user-' + Math.random();
    const civilizationName = 'civilization-' + Math.random();
    const password = '12345';
    
    let civilizationId;

    service.getStatus().subscribe(status => {
      if (status.sessionStarted) {
        if (!civilizationId) {
          expect(status.civilization).toBeNull();
          service.createCivilization(civilizationName).subscribe(id => {
            expect(id).toBeDefined();
            civilizationId = id;

            service.closeSession();
            service.login(user, password).subscribe();
          });
        } else {
          expect(status.civilization.id).toEqual(civilizationId);
          expect(status.civilization.name).toEqual(civilizationName);
          done();
        }
      }
    });

    service.register(user, password).subscribe(() => {
      
      service.login(user, password).subscribe((session) => {
        expect(session.authToken).toBeDefined();
      });

    });

  });


});

function createGvApiServiceWithInitialToken(): GvApiService {
  return new GvApiService(createApiService(), TestBed.get(LocalStorageService));
}

function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new AuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}