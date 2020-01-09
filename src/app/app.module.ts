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
import { TextRendererComponent } from './components/text-renderer/text-renderer.component';
import { SelectedEntityComponent } from './components/selected-entity/selected-entity.component';
import { StarSystemInfoComponent } from './components/selected-entity/star-system-info/star-system-info.component';
import { FleetInfoComponent } from './components/selected-entity/fleet-info/fleet-info.component';
import { PlanetInfoComponent } from './components/selected-entity/planet-info/planet-info.component';
import { HoveredInfoComponent } from './components/hovered-info/hovered-info.component';
import { CentralWindowComponent } from './components/central-window/central-window.component';
import { WindowManagerServiceImpl } from './services/window-manager.service';
import { WindowManagerService } from './services/window-manager.service-abstract';
import { ModalFrameComponent } from './components/modals/modal-frame/modal-frame.component';
import { ModalContainerComponent } from './components/modals/modal-container/modal-container.component';
import { ModalService } from './services/modal.service-abstract';
import { ModalServiceImpl } from './services/modal.service';


@NgModule({
  declarations: [
    AppComponent,
    IndexComponent,
    CreateCivilizationComponent,
    TextRendererComponent,
    SelectedEntityComponent,
    StarSystemInfoComponent,
    FleetInfoComponent,
    PlanetInfoComponent,
    HoveredInfoComponent,
    CentralWindowComponent,
    ModalFrameComponent,
    ModalContainerComponent
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
    { provide: 'Window', useValue: window },
    { provide: ModalService, useClass: ModalServiceImpl },
    { provide: WindowManagerService, useClass: WindowManagerServiceImpl },
  ],
  bootstrap: [AppComponent],
  entryComponents: [
    ModalFrameComponent
  ]
})
export class AppModule { }
