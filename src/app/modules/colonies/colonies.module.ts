import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { ColoniesIndexComponent } from './components/colonies-index/colonies-index.component';
import { TableModule } from '@piros/table';
import { NameRenderComponent } from './components/colonies-index/renders/name-render/name-render.component';

@NgModule({
  declarations: [
    ColoniesIndexComponent,
    NameRenderComponent
  ],
  imports: [
    CommonModule,
    TableModule
  ],
  exports: [
    ColoniesIndexComponent
  ],
  entryComponents: [
    NameRenderComponent
  ]
})
export class ColoniesModule { }
