import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { BattlesRoutingModule } from './battles-routing.module';
import { BattlesIndexComponent } from './components/battles-index/battles-index.component';

@NgModule({
  declarations: [BattlesIndexComponent],
  imports: [
    CommonModule,
    BattlesRoutingModule
  ]
})
export class BattlesModule { }
