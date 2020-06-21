import { AuthService, AuthStatus } from './auth.service';
import { CivilizationsService } from './data/civilizations.service';

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