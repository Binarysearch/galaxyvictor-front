import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { CivilizationsIndexComponent } from './components/civilizations-index/civilizations-index.component';

const routes: Routes = [
  { path: 'civilizations', component: CivilizationsIndexComponent }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class CivilizationsRoutingModule { }
