import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import{TranslateModule} from '@ngx-translate/core';

import { AdministrativoPageRoutingModule } from './administrativo-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';

import { AdministrativoPage } from './administrativo.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AdministrativoPageRoutingModule,
    TranslateModule

  ],
  declarations: [AdministrativoPage],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
  
})
export class AdministrativoPageModule {}
