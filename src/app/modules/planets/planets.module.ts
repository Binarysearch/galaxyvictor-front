import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { PlanetsIndexComponent } from './components/planets-index/planets-index.component';
import { TableModule } from '@piros/table';
import { TypeRenderComponent } from './components/planets-index/renders/type-render/type-render.component';
import { SizeRenderComponent } from './components/planets-index/renders/size-render/size-render.component';
import { StarSystemRenderComponent } from './components/planets-index/renders/star-system-render/star-system-render.component';
import { NameRenderComponent } from './components/planets-index/renders/name-render/name-render.component';

@NgModule({
  declarations: [
    PlanetsIndexComponent,
    TypeRenderComponent,
    SizeRenderComponent,
    StarSystemRenderComponent,
    NameRenderComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    PlanetsIndexComponent
  ],
  entryComponents: [
    TypeRenderComponent,
    SizeRenderComponent,
    StarSystemRenderComponent,
    NameRenderComponent
  ]
})
export class PlanetsModule { }
