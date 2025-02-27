import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import{TranslateModule} from '@ngx-translate/core';

import { PrediccionesPageRoutingModule } from './predicciones-routing.module';

import { PrediccionesPage } from './predicciones.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    PrediccionesPageRoutingModule,
    TranslateModule

  ],
  declarations: [PrediccionesPage]
})
export class PrediccionesPageModule {}
