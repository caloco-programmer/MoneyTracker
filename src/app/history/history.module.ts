import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { HistoryPageRoutingModule } from './history-routing.module';
import{TranslateModule} from '@ngx-translate/core';

import { HistoryPage } from './history.page';

import { RouterModule } from '@angular/router';
import { ComponentsModule } from '../components/components.module';


@NgModule({
  imports: [
    CommonModule,
    ComponentsModule,
    FormsModule,
    IonicModule,
    HistoryPageRoutingModule,
    RouterModule.forChild([{ path: '', component: HistoryPage }]),
    TranslateModule

  ],
  declarations: [HistoryPage,
    
  ]
})
export class HistoryPageModule {}
