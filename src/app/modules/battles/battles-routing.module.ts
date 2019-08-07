import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { BattlesIndexComponent } from './components/battles-index/battles-index.component';

const routes: Routes = [
  { path: 'battles', component: BattlesIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class BattlesRoutingModule { }
