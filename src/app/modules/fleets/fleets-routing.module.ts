import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { FleetsIndexComponent } from './components/fleets-index/fleets-index.component';

const routes: Routes = [
  { path: 'fleets', component: FleetsIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class FleetsRoutingModule { }
