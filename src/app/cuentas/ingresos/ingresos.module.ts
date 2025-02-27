import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import{TranslateModule} from '@ngx-translate/core';

import { IngresosPageRoutingModule } from './ingresos-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { IngresosPage } from './ingresos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IngresosPageRoutingModule,
    TranslateModule

  ],
  declarations: [IngresosPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]

})
export class IngresosPageModule {}
