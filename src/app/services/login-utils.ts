import { AuthService, AuthStatus } from './auth.service';
import { CivilizationsService } from './data/civilizations.service';
import { PirosApiService, ConnectorManagerService, IdGeneratorService, RequestService, AuthService as PirosAuthService, ChannelService } from '@piros/api';
import { config } from './config';
import { HttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { Civilization } from '../model/civilization';
import { MapStateService } from './map-state.service';
import { LocalStorageService } from './local-storage.service';
import { StarsService } from './data/stars.service';
import { TimeService } from './time.service';
import { FleetsService } from './data/fleets.service';
import { Fleet } from '../model/fleet';
import { StarSystem } from '../model/star-system';
import { first } from 'rxjs/operators';
import { PlanetsService } from './data/planets.service';
import { NotificationService } from './notification.service';
import { ColoniesService } from './data/colonies.service';
import { ShipsService } from './data/ships.service';

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


export function registerLoginAndCreateCivilization(authService: AuthService, civilizationService: CivilizationsService, callback: (user: string, password: string, civilization: Civilization) => void) {

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
      callback(user, password, civ);
    }
  });

  authService.register(user, password).subscribe(() => {
    authService.login(user, password).subscribe();
  });
}

export interface ServicesAndData {
  credentials: { user: string; password: string; };
  civilization: Civilization;
  startingFleet: Fleet;
  homeStar: StarSystem;
  services: {
    apiService: PirosApiService;
    authService: AuthService;
    civilizationsService: CivilizationsService;
    starsService: StarsService;
    fleetsService: FleetsService;
    planetsService: PlanetsService;
    notificationService: NotificationService;
    coloniesService: ColoniesService;
    shipsService: ShipsService;
  },
  getRandomStar: () => StarSystem
}

export function quickStart(callback: (servicesAndData: ServicesAndData) => void) {
  const apiService = createApiService();
  const notificationService: NotificationService = new NotificationService(apiService);
  TestBed.get(LocalStorageService).deleteSavedToken();
  const authService = new AuthService(apiService, TestBed.get(LocalStorageService), TestBed.get(MapStateService));
  const civilizationsService = new CivilizationsService(apiService, authService);
  const starsService: StarsService = new StarsService(apiService, authService);
  const fleetsService = new FleetsService(starsService, apiService, authService, civilizationsService, TestBed.get(TimeService), notificationService);
  const planetsService: PlanetsService = new PlanetsService(starsService, apiService, authService, civilizationsService);
  const coloniesService: ColoniesService = new ColoniesService(apiService, authService, civilizationsService, planetsService, notificationService);
  const shipsService: ShipsService = new ShipsService(apiService);

  let done = false;
  
  registerLoginAndCreateCivilization(authService, civilizationsService, (user, password, civilization) => {

    fleetsService.isLoaded().pipe(first(l => l)).subscribe(()=>{
      fleetsService.getFleets().subscribe(fleetSet => {
        const fleet: Fleet = fleetSet.values().next().value;

        starsService.getStars().subscribe(stars => {
          const getRandomStar = () => {
            let star: StarSystem = stars[Math.floor(Math.random() * stars.length)];
            while (star.id === fleet.destination.id) {
              star = stars[Math.floor(Math.random() * stars.length)];
            }
            return star;
          }

          if (!done) {
            done = true;
            callback({
              credentials: {
                user: user,
                password: password
              },
              civilization: civilization,
              startingFleet: fleet,
              homeStar: fleet.destination,
              services: {
                apiService: apiService,
                authService: authService,
                civilizationsService: civilizationsService,
                starsService: starsService,
                fleetsService: fleetsService,
                planetsService: planetsService,
                notificationService: notificationService,
                coloniesService: coloniesService,
                shipsService: shipsService,
              },
              getRandomStar: getRandomStar
            });
          }
          
        });
      });
    });
  });
}

export function createApiService(): PirosApiService {
  const connectorManager = new ConnectorManagerService(new IdGeneratorService(), config);
  const api = new PirosApiService(new PirosAuthService(connectorManager), new RequestService(connectorManager, config, TestBed.get(HttpClient)), new ChannelService(connectorManager, config), config);
  return api;
}