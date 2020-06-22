import { TestBed } from '@angular/core/testing';

import { MapStateService } from './map-state.service';
import { HttpClientModule, HttpClient } from '@angular/common/http';
import { ApiService, PIROS_API_SERVICE_CONFIG, PirosApiService, ConnectorManagerService, IdGeneratorService, AuthService as PirosAuthService, RequestService, ChannelService } from '@piros/api';
import { config } from './config';
import { registerAndLogin } from './login-utils';
import { AuthService, AuthStatus } from './auth.service';
import { LocalStorageService } from './local-storage.service';

describe('MapStateService', () => {

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
  });

  it('should save session state', (done) => {
    const service: MapStateService = TestBed.get(MapStateService);
    const authService = TestBed.get(AuthService);
    
    registerAndLogin(authService, () => {
      
      service.setSessionstate({
        cameraX: 12,
        cameraY: 13,
        cameraZ: 14,
        selectedId: '15',
        selectedType: 'star'
      }).subscribe(() => {

        service.getSessionState().subscribe(state => {
          expect(state).toEqual({
            cameraX: 12,
            cameraY: 13,
            cameraZ: 14,
            selectedId: '15',
            selectedType: 'star'
          });
          done();
        });
      });

    });

  });

  it('should delete session state when login', (done) => {
    const service: MapStateService = TestBed.get(MapStateService);
    const authService = TestBed.get(AuthService);
    const service2: MapStateService = TestBed.get(MapStateService);
    const authService2 = new AuthService(createApiService(), TestBed.get(LocalStorageService), service2);
    
    registerAndLogin(authService, (user, password) => {
      
      service.setSessionstate({
        cameraX: 12,
        cameraY: 13,
        cameraZ: 14,
        selectedId: '15',
        selectedType: 'star'
      }).subscribe(() => {

        service.getSessionState().subscribe(state => {
          expect(state).toEqual({
            cameraX: 12,
            cameraY: 13,
            cameraZ: 14,
            selectedId: '15',
            selectedType: 'star'
          });

          authService2.login(user, password).subscribe(()=>{
            service.getSessionState().subscribe(state => {
              expect(state).toEqual(<any>{});
              done();
            });
          });
        });
      });

    });

  });

});


function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new PirosAuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}