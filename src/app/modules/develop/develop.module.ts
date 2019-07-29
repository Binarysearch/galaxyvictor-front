import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TableModule } from '@piros/table';

import { DevelopRoutingModule } from './develop-routing.module';
import { DevelopIndexComponent } from './components/develop-index/develop-index.component';
import { EndpointListComponent } from './components/endpoint-list/endpoint-list.component';

@NgModule({
  declarations: [DevelopIndexComponent, EndpointListComponent],
  imports: [
    CommonModule,
    TableModule,
    DevelopRoutingModule
  ]
})
export class DevelopModule { }
