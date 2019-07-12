import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { AuthModule } from './modules/auth/auth.module';

export interface AppRoute extends Route {
  title: string;
}

export const APP_MAIN_ROUTES: AppRoute[] = [
  {
    path: 'develop',
    title: 'Develop',
    loadChildren: () => import('./modules/develop/develop.module').then(mod => mod.DevelopModule)
  },
  {
    path: 'admin',
    title: 'Admin',
    loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule)
  },
  {
    path: 'universe',
    title: 'Universe',
    loadChildren: () => import('./modules/universe/universe.module').then(mod => mod.UniverseModule)
  },
  {
    path: 'galaxy',
    title: 'Galaxy',
    loadChildren: () => import('./modules/galaxy/galaxy.module').then(mod => mod.GalaxyModule)
  },
  {
    path: 'civilizations',
    title: 'Civilizations',
    loadChildren: () => import('./modules/civilizations/civilizations.module').then(mod => mod.CivilizationsModule)
  },
  {
    path: 'colonies',
    title: 'Colonies',
    loadChildren: () => import('./modules/colonies/colonies.module').then(mod => mod.ColoniesModule)
  },
  {
    path: 'fleets',
    title: 'Fleets',
    loadChildren: () => import('./modules/fleets/fleets.module').then(mod => mod.FleetsModule)
  },
  {
    path: 'planets',
    title: 'Planets',
    loadChildren: () => import('./modules/planets/planets.module').then(mod => mod.PlanetsModule)
  },
  {
    path: 'trade',
    title: 'Trade',
    loadChildren: () => import('./modules/trade/trade.module').then(mod => mod.TradeModule)
  },
  {
    path: 'research',
    title: 'Research',
    loadChildren: () => import('./modules/research/research.module').then(mod => mod.ResearchModule)
  },
  {
    path: 'battles',
    title: 'Battles',
    loadChildren: () => import('./modules/battles/battles.module').then(mod => mod.BattlesModule)
  },
  {
    path: '',
    title: 'Home',
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
