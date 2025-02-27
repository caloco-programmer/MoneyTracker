import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import{TranslateModule} from '@ngx-translate/core';

import { AmigosPageRoutingModule } from './amigos-routing.module';

import { AmigosPage } from './amigos.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    AmigosPageRoutingModule,
    TranslateModule

  ],
  declarations: [AmigosPage]
})
export class AmigosPageModule {}
