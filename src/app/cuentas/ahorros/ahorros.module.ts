import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';

import { AhorrosPageRoutingModule } from './ahorros-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import{TranslateModule} from '@ngx-translate/core';

import { AhorrosPage } from './ahorros.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AhorrosPageRoutingModule,
    TranslateModule

    
  ],
  declarations: [AhorrosPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]

})
export class AhorrosPageModule {}
