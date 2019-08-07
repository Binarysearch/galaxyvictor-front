import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { PlanetsIndexComponent } from './components/planets-index/planets-index.component';

const routes: Routes = [
  { path: 'planets', component: PlanetsIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class PlanetsRoutingModule { }
