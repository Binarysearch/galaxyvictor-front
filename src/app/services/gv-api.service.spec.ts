import { TestBed } from '@angular/core/testing';

import { GvApiService } from './gv-api.service';
import { ApiService, PIROS_API_SERVICE_CONFIG, PirosApiService, ConnectorManagerService, IdGeneratorService, AuthService, RequestService, ChannelService } from '@piros/api';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { LocalStorageService } from './local-storage.service';
import { config } from './config';
import { Status } from '../model/gv-api-service-status';


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

  it('should save session state', (done) => {
    const service: GvApiService = TestBed.get(GvApiService);

    const user = 'user-' + Math.random();
    const password = '12345';

    service.getStatus().subscribe(status => {
      if (status.sessionStarted === Status.SESSION_STARTED) {

        service.setSessionstate({
          cameraX: 12,
          cameraY: 13,
          cameraZ: 14,
          selectedId: '15',
          selectedType: 'star'
        }).subscribe(() => {

          const service2 = createGvApiServiceWithInitialToken();

          service2.getStatus().subscribe(
            status => {
              if (status.sessionStarted === Status.SESSION_STARTED) {
                service.getSessionState().subscribe((state) => {

                  expect(state).toEqual({
                    cameraX: 12,
                    cameraY: 13,
                    cameraZ: 14,
                    selectedId: '15',
                    selectedType: 'star'
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
      if (status.sessionStarted === Status.SESSION_STARTED) {

        service.setSessionstate({
          cameraX: 12,
          cameraY: 13,
          cameraZ: 14,
          selectedId: '15',
          selectedType: 'star'
        }).subscribe(() => {

          const service2 = createGvApiServiceWithInitialToken();

          service2.login(user, password).subscribe((session) => {

            service2.getStatus().subscribe(
              status => {
                if (status.sessionStarted === Status.SESSION_STARTED) {
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


});

function createGvApiServiceWithInitialToken(): GvApiService {
  return new GvApiService(createApiService(), TestBed.get(LocalStorageService));
}

function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new AuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}

