import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';
import { AuthModule } from './modules/auth/auth.module';

const routes: Routes = [
  {
    path: 'develop',
    loadChildren: () => import('./modules/develop/develop.module').then(mod => mod.DevelopModule)
  },
  {
    path: 'admin',
    loadChildren: () => import('./modules/admin/admin.module').then(mod => mod.AdminModule)
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
    RouterModule.forRoot(routes),
    AuthModule
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
