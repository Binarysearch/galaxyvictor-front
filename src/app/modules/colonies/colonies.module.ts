import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColoniesRoutingModule } from './colonies-routing.module';
import { ColoniesIndexComponent } from './components/colonies-index/colonies-index.component';

@NgModule({
  declarations: [ColoniesIndexComponent],
  imports: [
    CommonModule,
    ColoniesRoutingModule
  ]
})
export class ColoniesModule { }
