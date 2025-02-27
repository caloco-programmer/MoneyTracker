import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouteReuseStrategy } from '@angular/router';
import { NgApexchartsModule } from "ng-apexcharts";
import { IonicModule, IonicRouteStrategy } from '@ionic/angular';
import { HttpClient, HttpClientModule } from '@angular/common/http';
import { PdfViewerModule } from 'ng2-pdf-viewer';
import{TranslateModule, TranslateLoader, TranslateService} from '@ngx-translate/core';
import{TranslateHttpLoader} from '@ngx-translate/http-loader';
import { AppComponent } from './app.component';
import { AppRoutingModule } from './app-routing.module';
import { AuthGuardService } from './services/auth/auth-guard.service';
import { SesionService } from './services/sesion.service';
export function HttpLoaderFactory(httpClient: HttpClient){
  return new TranslateHttpLoader(httpClient, "../assets/i18n/", ".json");
}

@NgModule({
  declarations: [AppComponent,
    
  ],
  imports: [BrowserModule, IonicModule.forRoot(), AppRoutingModule,NgApexchartsModule,HttpClientModule,PdfViewerModule,
    TranslateModule.forRoot({
      loader: {
        provide: TranslateLoader,
        useFactory: HttpLoaderFactory,
        deps: [HttpClient]
      }
    }),

  ],
  
  
  providers: [{ provide: RouteReuseStrategy, useClass: IonicRouteStrategy },
    {
      provide: AuthGuardService,
      useClass: AuthGuardService,
    },
    // Proveedor para SesionService
    {
      provide: SesionService,
      useClass: SesionService,
    },
  ],
  bootstrap: [AppComponent],
  
})
export class AppModule {}
