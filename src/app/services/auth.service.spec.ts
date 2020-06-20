import { TestBed } from '@angular/core/testing';

import { AuthService, AuthStatus } from './auth.service';
import { LocalStorageService } from './local-storage.service';
import { HttpClientModule, HttpErrorResponse, HttpClient } from '@angular/common/http';
import { config } from './config';
import { PIROS_API_SERVICE_CONFIG, PirosApiService, ConnectorManagerService, IdGeneratorService, RequestService, ChannelService } from '@piros/api';
import { AuthService as PirosAuthService } from '@piros/api';

describe('AuthService', () => {

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientModule
      ],
      providers: [
        { provide: PIROS_API_SERVICE_CONFIG, useValue: config }
      ]
    });

    const localStorageService: LocalStorageService = TestBed.get(LocalStorageService);
    localStorageService.deleteSavedToken();
  });

  it('should register user', (done) => {
    const service: AuthService = TestBed.get(AuthService);

    const user = 'user-' + Math.random();
    const password = '12345';

    service.register(user, password).subscribe(userId => {
      expect(userId).toBeDefined();
      done();
    });

  });

  it('should not register with existing user', (done) => {
    const service: AuthService = TestBed.get(AuthService);

    const user = 'user-' + Math.random();
    const password = '12345';

    service.register(user, password).subscribe(() => {

      service.register(user, password).subscribe(
        () => { },
        error => {
          expect((<HttpErrorResponse>error).status).toEqual(409);
          expect(error).toBeDefined();
          done();
        }
      );
    });

  });

  it('should login with registered user', (done) => {
    const service: AuthService = TestBed.get(AuthService);

    const user = 'user-' + Math.random();
    const password = '12345';

    service.getStatus().subscribe(status => {
      if (status === AuthStatus.SESSION_STARTED) {
        expect(status).toBeTruthy();
        done();
      }
    });

    service.register(user, password).subscribe(() => {

      service.login(user, password).subscribe((authToken) => {
        expect(authToken).toBeDefined();
      });

    });

  });

  it('should not login with unregistered user', (done) => {
    const service: AuthService = TestBed.get(AuthService);

    const user = 'user-' + Math.random();
    const password = '12345';

    service.login(user, password).subscribe(
      () => { },
      (err) => {
        expect(err).toEqual('INVALID_CREDENTIALS');
        done();
      }
    );

  });

  it('should auto login with previously generated token', (done) => {
    const service1: AuthService = TestBed.get(AuthService);

    const user = 'user-' + Math.random();
    const password = '12345';

    service1.register(user, password).subscribe(() => {
      service1.login(user, password).subscribe((session) => {

        const service2 = createGvApiServiceWithInitialToken();

        service2.getStatus().subscribe(
          status => {
            if (status === AuthStatus.SESSION_STARTED) {
              expect(status).toBeTruthy();
              done();
            }
          }
        );

      });
    });

  });

  it('should not auto login with previously generated token if session was closed', (done) => {
    const service1: AuthService = TestBed.get(AuthService);

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
            expect(status).toEqual(AuthStatus.SESSION_CLOSED);
          }
        );

      });
    });

  });
  
});

function createGvApiServiceWithInitialToken(): AuthService {
  return new AuthService(createApiService(), TestBed.get(LocalStorageService));
}

function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new PirosAuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}