import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import{TranslateModule} from '@ngx-translate/core';

import { IonicModule } from '@ionic/angular';

import { IndexPageRoutingModule } from './index-routing.module';
import { CUSTOM_ELEMENTS_SCHEMA } from '@angular/core';
import { IndexPage } from './index.page';

@NgModule({
  imports: [
    CommonModule,
    FormsModule,
    IonicModule,
    IndexPageRoutingModule,
    TranslateModule

  ],
  declarations: [IndexPage ],
  schemas: [ CUSTOM_ELEMENTS_SCHEMA]
})
export class IndexPageModule {}
