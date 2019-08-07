import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { ResearchIndexComponent } from './components/research-index/research-index.component';

const routes: Routes = [
  { path: 'research', component: ResearchIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class ResearchRoutingModule { }
