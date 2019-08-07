import { BrowserModule } from '@angular/platform-browser';
import { NgModule, APP_INITIALIZER } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { DashboardModule } from '@piros/dashboard';
import { EndPointService } from './services/end-point.service';
import { AuthService } from './modules/auth/services/auth.service';
import { SocketService, SocketStatus } from './services/socket.service';
import { first } from 'rxjs/operators';
import { AuthModule } from './modules/auth/auth.module';
import { BattlesModule } from './modules/battles/battles.module';
import { AdminModule } from './modules/admin/admin.module';
import { CivilizationsModule } from './modules/civilizations/civilizations.module';
import { ColoniesModule } from './modules/colonies/colonies.module';
import { DevelopModule } from './modules/develop/develop.module';
import { FleetsModule } from './modules/fleets/fleets.module';
import { GalaxyModule } from './modules/galaxy/galaxy.module';
import { PlanetsModule } from './modules/planets/planets.module';
import { ResearchModule } from './modules/research/research.module';
import { TradeModule } from './modules/trade/trade.module';
import { UniverseModule } from './modules/universe/universe.module';

export function initializer(
    endPointService: EndPointService,
    auth: AuthService,
    socket: SocketService
  ): () => Promise<void> {
  return () => new Promise((resolve) =>{ 
    endPointService.loadEndPoints().then(() => {

      const session = auth.loadFromStorage();

      if (session) {
        auth.setSession(session);
        socket.getStatus().pipe(
          first(status => {
            return status === SocketStatus.SESSION_STARTED || 
            status === SocketStatus.CLOSED;
          })
        ).subscribe((status) => {
          console.log('RESOLVED');
          resolve();
        });
      } else {
        console.log('RESOLVED');
        resolve();
      }

    });
  });
}

@NgModule({
  declarations: [
    AppComponent,
    IndexComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AdminModule,
    BattlesModule,
    CivilizationsModule,
    ColoniesModule,
    DevelopModule,
    FleetsModule,
    GalaxyModule,
    PlanetsModule,
    ResearchModule,
    TradeModule,
    UniverseModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule
  ],
  providers: [
    {
      provide: APP_INITIALIZER,
      useFactory: initializer,
      multi: true,
      deps: [ EndPointService, AuthService, SocketService ]
    }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
