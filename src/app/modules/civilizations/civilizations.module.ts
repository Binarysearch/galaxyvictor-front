import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';

import { CivilizationsRoutingModule } from './civilizations-routing.module';
import { CivilizationsIndexComponent } from './components/civilizations-index/civilizations-index.component';

@NgModule({
  declarations: [CivilizationsIndexComponent],
  imports: [
    CommonModule,
    CivilizationsRoutingModule
  ]
})
export class CivilizationsModule { }
