import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { FleetsIndexComponent } from './components/fleets-index/fleets-index.component';
import { TableModule } from '@piros/table';
import { StarSystemRenderComponent } from './components/fleets-index/renders/star-system-render/star-system-render.component';
import { StatusRenderComponent } from './components/fleets-index/renders/status-render/status-render.component';
import { CivilizationRenderComponent } from './components/fleets-index/renders/civilization-render/civilization-render.component';
import { NameRenderComponent } from './components/fleets-index/renders/name-render/name-render.component';

@NgModule({
  declarations: [
    FleetsIndexComponent,
    StarSystemRenderComponent,
    StatusRenderComponent,
    CivilizationRenderComponent,
    NameRenderComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    FleetsIndexComponent
  ],
  entryComponents: [
    StarSystemRenderComponent,
    CivilizationRenderComponent,
    StatusRenderComponent,
    NameRenderComponent
  ]
})
export class FleetsModule { }
