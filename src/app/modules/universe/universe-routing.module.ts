import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { UniverseIndexComponent } from './components/universe-index/universe-index.component';

const routes: Routes = [
  { path: 'universe', component: UniverseIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class UniverseRoutingModule { }
