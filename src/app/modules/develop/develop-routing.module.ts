import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevelopIndexComponent } from './components/develop-index/develop-index.component';
import { EndpointListComponent } from './components/endpoint-list/endpoint-list.component';

const routes: Routes = [
  { path: '', component: DevelopIndexComponent },
  { path: 'endpoints', component: EndpointListComponent }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule]
})
export class DevelopRoutingModule { }
