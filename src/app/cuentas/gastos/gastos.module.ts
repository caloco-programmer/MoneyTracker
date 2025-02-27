import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { GastosPageRoutingModule } from './gastos-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import{TranslateModule} from '@ngx-translate/core';

import { GastosPage } from './gastos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    GastosPageRoutingModule,
    TranslateModule

  ],
  declarations: [GastosPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]

})
export class GastosPageModule {}
