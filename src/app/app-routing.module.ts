import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { AuthModule } from './modules/auth/auth.module';

const APP_MAIN_ROUTES: Route[] = [
  {
    path: 'develop',
    loadChildren: () => import('./modules/develop/develop.module').then(mod => mod.DevelopModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: 'universe',
    loadChildren: () => import('./modules/universe/universe.module').then(mod => mod.UniverseModule)
  },
  {
    path: 'galaxy',
    loadChildren: () => import('./modules/galaxy/galaxy.module').then(mod => mod.GalaxyModule)
  },
  {
    path: 'civilizations',
    loadChildren: () => import('./modules/civilizations/civilizations.module').then(mod => mod.CivilizationsModule)
  },
  {
    path: 'colonies',
    loadChildren: () => import('./modules/colonies/colonies.module').then(mod => mod.ColoniesModule)
  },
  {
    path: 'fleets',
    loadChildren: () => import('./modules/fleets/fleets.module').then(mod => mod.FleetsModule)
  },
  {
    path: 'planets',
    loadChildren: () => import('./modules/planets/planets.module').then(mod => mod.PlanetsModule)
  },
  {
    path: 'trade',
    loadChildren: () => import('./modules/trade/trade.module').then(mod => mod.TradeModule)
  },
  {
    path: 'research',
    loadChildren: () => import('./modules/research/research.module').then(mod => mod.ResearchModule)
  },
  {
    path: 'battles',
    loadChildren: () => import('./modules/battles/battles.module').then(mod => mod.BattlesModule)
  },
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    component: IndexComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_MAIN_ROUTES),
    AuthModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
