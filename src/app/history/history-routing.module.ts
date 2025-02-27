import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { HistoryPage } from './history.page';

const routes: Routes = [
  {
    path: 'history',
    component: HistoryPage
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes)],
  exports: [RouterModule],
})
export class HistoryPageRoutingModule {}
