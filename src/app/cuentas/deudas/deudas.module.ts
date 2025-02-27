import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { DeudasPageRoutingModule } from './deudas-routing.module';
import{TranslateModule} from '@ngx-translate/core';

import { DeudasPage } from './deudas.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    DeudasPageRoutingModule,
    TranslateModule

  ],
  declarations: [DeudasPage]
})
export class DeudasPageModule {}
