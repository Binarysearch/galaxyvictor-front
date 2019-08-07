import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { AdminRoutingModule } from './admin-routing.module';
import { AdminIndexComponent } from './components/admin-index/admin-index.component';
import { UsersComponent } from './components/users/users.component';
import { TableModule } from '@piros/table';

@NgModule({
  declarations: [AdminIndexComponent, UsersComponent],
  imports: [
    CommonModule,
    TableModule,
    AdminRoutingModule
  ]
})
export class AdminModule { }
