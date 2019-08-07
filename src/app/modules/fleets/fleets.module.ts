import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetsRoutingModule } from './fleets-routing.module';
import { FleetsIndexComponent } from './components/fleets-index/fleets-index.component';

@NgModule({
  declarations: [FleetsIndexComponent],
  imports: [
    CommonModule,
    FleetsRoutingModule
  ]
})
export class FleetsModule { }
