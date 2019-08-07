import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ColoniesIndexComponent } from './components/colonies-index/colonies-index.component';

const routes: Routes = [
  { path: 'colonies', component: ColoniesIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ColoniesRoutingModule { }
