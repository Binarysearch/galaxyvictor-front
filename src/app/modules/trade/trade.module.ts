import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { TradeRoutingModule } from './trade-routing.module';
import { TradeIndexComponent } from './components/trade-index/trade-index.component';

@NgModule({
  declarations: [TradeIndexComponent],
  imports: [
    CommonModule,
    TradeRoutingModule
  ]
})
export class TradeModule { }
