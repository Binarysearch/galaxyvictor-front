import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ResearchRoutingModule } from './research-routing.module';
import { ResearchIndexComponent } from './components/research-index/research-index.component';

@NgModule({
  declarations: [ResearchIndexComponent],
  imports: [
    CommonModule,
    ResearchRoutingModule
  ]
})
export class ResearchModule { }
