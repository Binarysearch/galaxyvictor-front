import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { TradeIndexComponent } from './components/trade-index/trade-index.component';

const routes: Routes = [
  { path: 'trade', component: TradeIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class TradeRoutingModule { }
