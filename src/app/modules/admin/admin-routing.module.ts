import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { UsersComponent } from './components/users/users.component';

const routes: Routes = [
  { path: 'admin', component: AdminIndexComponent },
  { path: 'admin/users', component: UsersComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AdminRoutingModule { }
