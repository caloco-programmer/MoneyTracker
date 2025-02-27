import { Component, OnInit } from '@angular/core';
import { ActionSheetController, ToastController } from '@ionic/angular';
import { Chart, ChartType } from 'chart.js/auto';
import { BackendService } from '../services/backend.service';
import { LoadingController, AlertController } from '@ionic/angular';
import { SesionService, User } from '../services/sesion.service';
import { Router } from '@angular/router';
import Swiper from 'swiper';
import { NavController } from '@ionic/angular';
import { IonicSlides } from '@ionic/angular';
//import {AdmobAds} from 'capacitor-admob-ads';
import{TranslateModule, TranslateService} from '@ngx-translate/core';

@Component({
  selector: 'app-administrativo',
  templateUrl: './administrativo.page.html',
  styleUrls: ['./administrativo.page.scss'],
})
export class AdministrativoPage implements OnInit {
expandedId: string | null = null;
  cantidadVisible: number = 5;
  mostrarTodos = false;
 
  gastosFiltrados: any[] = [];
  public tarjetas  :[] | any;
  public persona: any; 
 


  totalDebito: number = 0;
  totalCredito: number = 0;
  totalGastos: number = 0;
  totalIngresos: number = 0;
  totalPrestamos: number = 0;
  totalDeudas: number = 0;
  totalAhorros: number = 0;
  private intervalId: any;
  cards = [
    { title: 'Card 1', content: 'This is the content of Card 1.' },
    { title: 'Card 2', content: 'This is the content of Card 2.' },
    { title: 'Card 3', content: 'This is the content of Card 3.' },
    { title: 'Card 4', content: 'This is the content of Card 4.' },
    { title: 'Card 5', content: 'This is the content of Card 5.' }
  ];

  darkMode: boolean = false;
  selectedDate: string = new Date().toISOString();
  automaticReports: boolean = false;
  emailPredictions: boolean = false;
  isPrivacyExpanded: boolean = false;


  openPrivacyPolicy() {
    // Implementar la lógica para abrir las políticas de privacidad
    // Por ejemplo, navegar a una nueva página o abrir un modal
    console.log('Abrir políticas de privacidad');
  }

  langs: string[] = [];

  isDarkMode = false;

  


  constructor(private backendService: BackendService,private sesionService: SesionService,private router: Router,
    private loadingController: LoadingController,private actionSheetCtrl: ActionSheetController,private navController: NavController,
    private translateService: TranslateService,
    public toastCtrl: ToastController,
   ) {
    const prefersDark = localStorage.getItem('dark-mode') === 'true';
    this.isDarkMode = prefersDark;
    document.body.classList.toggle('dark-theme', prefersDark);
   }

    ngOnInit() {
       // Previous initialization code remains the same
    const savedTheme = localStorage.getItem('darkMode');
    this.darkMode = savedTheme === 'true';
    this.applyTheme();
    this.langs = this.translateService.getLangs();
    }
    
  changeCurrency(event: any) {
    const selectedCurrency = event.detail.value;
    localStorage.setItem('selectedCurrency', selectedCurrency); // Guardar la moneda seleccionada en localStorage
  }

  // Método para obtener la moneda almacenada
  getSelectedCurrency() {
    return localStorage.getItem('selectedCurrency') || 'CLP'; // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }

  toggleDarkMode() {
    this.isDarkMode = !this.isDarkMode;
    document.body.classList.toggle('dark-theme', this.isDarkMode);
    localStorage.setItem('dark-mode', this.isDarkMode.toString());
  }
  changeLang(event: any) {
    const selectedLanguage = event.detail.value;
    this.translateService.use(selectedLanguage);
    localStorage.setItem('language', selectedLanguage); // Guarda el idioma en localStorage
    console.log(selectedLanguage);
  }
  // Previous methods remain the same
  toggleTheme() {
    this.darkMode = !this.darkMode;
    this.applyTheme();
    localStorage.setItem('darkMode', this.darkMode.toString());
  }

  applyTheme() {
    document.body.classList.toggle('dark-theme', this.darkMode);
  }

  // Nuevos métodos para manejar las políticas de privacidad
  togglePrivacyPolicy() {
    this.isPrivacyExpanded = !this.isPrivacyExpanded;
  }

  async openFullPrivacyPolicy() {
    // Aquí puedes implementar la lógica para abrir la versión completa
    // Por ejemplo, abrir un modal o navegar a una nueva página
    // window.open('URL_DE_TUS_POLITICAS', '_blank');
    // O navegar dentro de la app:
    // this.router.navigate(['/full-privacy-policy']);
  }
  getSelectedLanguaje() {

    return localStorage.getItem('language') ;
     // Devuelve 'CLP' por defecto si no hay moneda almacenada
  }
    finalizarTutorial() {
      localStorage.setItem('TutorialStorage', 'true');
      this.navController.navigateRoot('/login/login');
    }
   
    swiperSlideChanged(event: any) {
      console.log('changed: ', event);
      console.log(event)
    }

    onOptionChange(event: { detail: { value: any; }; }) {
      const option = event.detail.value;
      console.log(option);
      // Navegar a la página "modal" con el valor seleccionado
      this.navController.navigateForward('/modal', {
        
        queryParams: { modalType: option },
      });
    }

    swiperModules = [IonicSlides];
  
    slideOpts = {
      slidesPerView: 1.5,
      centeredSlides: true,
      loop: true,
      spaceBetween: 10,
      autoplay: {
        delay: 2000
      },
      effect: 'slide',
      direction: 'horizontal',
      initialSlide: 0,
    };


}
