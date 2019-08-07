import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { GalaxyRoutingModule } from './galaxy-routing.module';
import { GalaxyIndexComponent } from './components/galaxy-index/galaxy-index.component';

@NgModule({
  declarations: [GalaxyIndexComponent],
  imports: [
    CommonModule,
    GalaxyRoutingModule
  ]
})
export class GalaxyModule { }
