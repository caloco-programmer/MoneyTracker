import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { PrediccionesPage } from './predicciones.page';

const routes: Routes = [
  {
    path: '',
    component: PrediccionesPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class PrediccionesPageRoutingModule {}
