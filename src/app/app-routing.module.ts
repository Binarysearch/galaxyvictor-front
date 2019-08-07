import { NgModule } from '@angular/core';
import { Route, RouterModule } from '@angular/router';
import { IndexComponent } from './components/index/index.component';

const APP_MAIN_ROUTES: Route[] = [
  {
    path: '',
    redirectTo: '',
    pathMatch: 'full',
    component: IndexComponent
  }
];

@NgModule({
  imports: [
    RouterModule.forRoot(APP_MAIN_ROUTES)
  ],
  exports: [RouterModule]
})
export class AppRoutingModule { }
