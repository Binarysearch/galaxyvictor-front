import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { UniverseRoutingModule } from './universe-routing.module';
import { UniverseIndexComponent } from './components/universe-index/universe-index.component';

@NgModule({
  declarations: [UniverseIndexComponent],
  imports: [
    CommonModule,
    UniverseRoutingModule
  ]
})
export class UniverseModule { }
