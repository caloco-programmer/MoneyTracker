import { Component, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';
import { register } from 'swiper/element/bundle';
import { BackendService } from './services/backend.service';
import { SesionService } from './services/sesion.service'; 
import { Router } from '@angular/router';

register();

@Component({
  selector: 'app-root',
  templateUrl: 'app.component.html',
  styleUrls: ['app.component.scss'],
})
export class AppComponent implements OnInit {
  public appPages = [
    { title: 'Inicio', url: '/index/index', icon: 'home' },
    { title: 'Perfil', url: '/perfil/perfil', icon: 'person' },
    { title: 'History', url: '/history/history', icon: 'today' },
    { title: 'Gastos', url: '/cuentas/gastos', icon: 'cart' },
    { title: 'Ahorros', url: '/cuentas/ahorros', icon: 'wallet' },
    { title: 'Categorias', url: '/categorias/categorias', icon: 'apps' },
    { title: 'Ingresos', url: '/cuentas/ingresos', icon: 'cash' },
    { title: 'Tarjetas', url: '/cuentas/cuentas', icon: 'card' },
    { title: 'Deudas', url: '/cuentas/deudas', icon: 'cash' },
    { title: 'Configuracion', url: '/config/config', icon: 'cog' },
    { title: 'Informes', url: '/informes/informes', icon: 'document' },
    { title: 'Predicciones', url: '/cuentas/predicciones', icon: 'calculator' },
    { title: 'Prestamos', url: '/prestamos/prestamos', icon: 'calculator' },
  ];
  // private interstitialAd: InterstitialAd | null = null; // Para manejar el anuncio intersticial
  // private interstitialAdId = 'ca-app-pub-3940256099942544/1033173712';

  constructor(
    private translateService: TranslateService,
    private sesionService: SesionService,
    private router: Router
  ) {
    this.translateService.setDefaultLang('English');
    this.translateService.addLangs(['English', 'Espanol', 'French', 'Portugues']);
    const savedLanguage = localStorage.getItem('language');
    if (savedLanguage) {
      this.translateService.use(savedLanguage);
      localStorage.setItem('language', savedLanguage);
    } else {
      // Si no hay idioma guardado, establece un idioma por defecto
      const defaultLanguage = 'espanol'; // Cambia esto según tu preferencia
      this.translateService.use(defaultLanguage);
      localStorage.setItem('language', defaultLanguage);
    }
  }

  ngOnInit() {
    const tutorial = localStorage.getItem('TutorialStorage') === 'true';

    if(tutorial){
      const keepLoggedIn = localStorage.getItem('keepLoggedIn') === 'true';
      if (keepLoggedIn && this.sesionService.isLoggedIn()) {
        this.router.navigate(['/index/index']);
      } else {
        this.sesionService.logout();
        localStorage.removeItem('keepLoggedIn'); 
        this.router.navigate(['/login/login']);
      }
    }else{
      this.router.navigate(['/administrativo/administrativo']);
    }
    
   
    
    // this.initializeAdMob();
    // this.startAdTimer(); 
  }
  // async initializeAdMob() {
  //   try {
  //     await AdMobPlus.start(); // Inicia el servicio de AdMob
  //     console.log('AdMob inicializado correctamente');

  //     // Crear el anuncio intersticial
  //     this.interstitialAd = new InterstitialAd({ adUnitId: this.interstitialAdId });

  //     // Cargar el anuncio intersticial
  //     await this.interstitialAd.load();
  //     console.log('Anuncio intersticial cargado');
  //   } catch (error) {
  //     console.error('Error al inicializar AdMob o cargar el anuncio:', error);
  //   }
  // }

  // // Mostrar anuncio intersticial
  // async showInterstitialAd() {
  //   if (this.interstitialAd) {
  //     try {
  //       await this.interstitialAd.show(); // Mostrar el anuncio
  //       console.log('Anuncio intersticial mostrado');
  //       await this.interstitialAd.load(); // Recargar el anuncio para la próxima vez
  //     } catch (error) {
  //       console.error('Error al mostrar el anuncio intersticial:', error);
  //     }
  //   } else {
  //     console.error('El anuncio intersticial no está inicializado');
  //   }
  // }

  // // Temporizador para mostrar anuncios cada 5 minutos
  // startAdTimer() {
  //   setInterval(() => {
  //     this.showInterstitialAd(); // Mostrar el anuncio
  //   }, 5 * 60 * 1000); // Cada 5 minutos
  // }
}
