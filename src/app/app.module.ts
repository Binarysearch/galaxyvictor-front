import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClientModule } from '@angular/common/http'

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { IndexComponent } from './components/index/index.component';
import { DashboardModule } from '@piros/dashboard';
import { AuthModule } from './modules/auth/auth.module';
import { BattlesModule } from './modules/battles/battles.module';
import { AdminModule } from './modules/admin/admin.module';
import { CivilizationsModule } from './modules/civilizations/civilizations.module';
import { ColoniesModule } from './modules/colonies/colonies.module';
import { FleetsModule } from './modules/fleets/fleets.module';
import { GalaxyModule } from './modules/galaxy/galaxy.module';
import { PlanetsModule } from './modules/planets/planets.module';
import { ResearchModule } from './modules/research/research.module';
import { TradeModule } from './modules/trade/trade.module';
import { UniverseModule } from './modules/universe/universe.module';
import { ApiModule } from '@piros/api';
import { CreateCivilizationComponent } from './components/create-civilization/create-civilization.component';
import { ReactiveFormsModule } from '@angular/forms';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CreateCivilizationComponent
  ],
  imports: [
    BrowserModule,
    AuthModule,
    AdminModule,
    BattlesModule,
    CivilizationsModule,
    ColoniesModule,
    FleetsModule,
    GalaxyModule,
    PlanetsModule,
    ResearchModule,
    TradeModule,
    UniverseModule,
    AppRoutingModule,
    HttpClientModule,
    DashboardModule,
    ApiModule,
    ReactiveFormsModule
  ],
  providers: [
    { provide: 'Window', useValue: window }
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
