import { GvApiService } from './gv-api.service';
import { Status } from '../model/gv-api-service-status';


export function loginWithCivilization(service: GvApiService, callback: () => void) {
  
  const user = 'user-' + Math.random();
  const civilizationName = 'civilization-' + Math.random();
  const password = '12345';

  let civilizationId;

  const subscription = service.getStatus().subscribe(status => {
    
    if (status.sessionStarted === Status.SESSION_STARTED) {
      if (!civilizationId) {
        
        service.createCivilization(civilizationName).subscribe(id => {
          civilizationId = id;
          service.closeSession();
          service.login(user, password).subscribe();
        });
      } else {
        subscription.unsubscribe();
        callback();
      }
    }
  });

  service.register(user, password).subscribe(() => {
    service.login(user, password).subscribe();
  });
}