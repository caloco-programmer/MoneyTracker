import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { IonicModule } from '@ionic/angular';
import{TranslateModule} from '@ngx-translate/core';

import { InformesPageRoutingModule } from './informes-routing.module';

import { InformesPage } from './informes.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    InformesPageRoutingModule,
    TranslateModule

  ],
  declarations: [InformesPage]
})
export class InformesPageModule {}
