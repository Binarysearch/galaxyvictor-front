import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { DevelopIndexComponent } from './components/develop-index/develop-index.component';
import { EndpointListComponent } from './components/endpoint-list/endpoint-list.component';

const routes: Routes = [
  { path: 'develop', component: DevelopIndexComponent },
  { path: 'develop/endpoints', component: EndpointListComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class DevelopRoutingModule { }
