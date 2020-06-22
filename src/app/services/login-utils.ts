import { AuthService, AuthStatus } from './auth.service';
import { CivilizationsService } from './data/civilizations.service';
import { PirosApiService, ConnectorManagerService, IdGeneratorService, RequestService, AuthService as PirosAuthService, ChannelService } from '@piros/api';
import { config } from './config';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';

export function registerAndLogin(service: AuthService, callback: (user: string, password: string) => void) {

  const user = 'user-' + Math.random();
  const password = '12345';

  const subscription = service.getStatus().subscribe(status => {

    if (status === AuthStatus.SESSION_STARTED) {
      subscription.unsubscribe();
      callback(user, password);
    }
  });

  service.register(user, password).subscribe(() => {
    service.login(user, password).subscribe();
  });
}


export function registerLoginAndCreateCivilization(authService: AuthService, civilizationService: CivilizationsService, callback: (user: string, password: string) => void) {

  const user = 'user-' + Math.random();
  const civName = 'civilization-' + Math.random();
  const password = '12345';

  const subscription = authService.getStatus().subscribe(status => {
    if (status === AuthStatus.SESSION_STARTED) {
      subscription.unsubscribe();
      civilizationService.createCivilization(civName).subscribe();
    }
  });

  const civSubscription = civilizationService.getCivilization().subscribe(civ => {
    if (civ) {
      civSubscription.unsubscribe();
      callback(user, password);
    }
  });

  authService.register(user, password).subscribe(() => {
    authService.login(user, password).subscribe();
  });
}

export function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new PirosAuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}