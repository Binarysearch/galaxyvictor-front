import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { GalaxyIndexComponent } from './components/galaxy-index/galaxy-index.component';

const routes: Routes = [
  { path: 'galaxy', component: GalaxyIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class GalaxyRoutingModule { }
